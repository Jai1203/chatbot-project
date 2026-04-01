from fastapi import FastAPI, HTTPException, Depends
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import sqlite3
import os
import logging
import re
from groq import Groq
from dotenv import load_dotenv
from datetime import datetime

# ── Load environment variables ──────────────────────────────────────────────
load_dotenv()

# ── Logging setup ────────────────────────────────────────────────────────────
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s [%(levelname)s] %(message)s",
    handlers=[
        logging.FileHandler("chatbot.log"),
        logging.StreamHandler()
    ]
)
logger = logging.getLogger(__name__)

# ── FastAPI app ───────────────────────────────────────────────────────────────
app = FastAPI(title="LLM Chatbot API", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],   # React dev server
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ── Database helpers ──────────────────────────────────────────────────────────
DB_PATH = os.getenv("DB_PATH", "customers.db")

def get_db():
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row        # rows behave like dicts
    try:
        yield conn
    finally:
        conn.close()


def init_db():
    """Create table and seed sample data if not present."""
    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()

    cursor.execute("""
        CREATE TABLE IF NOT EXISTS customers (
            customer_id INTEGER PRIMARY KEY AUTOINCREMENT,
            name        TEXT    NOT NULL,
            gender      TEXT    NOT NULL,
            location    TEXT    NOT NULL
        )
    """)

    # Only seed if empty
    if cursor.execute("SELECT COUNT(*) FROM customers").fetchone()[0] == 0:
        sample_customers = [
            ("Priya Sharma",   "Female", "Mumbai"),
            ("Rahul Verma",    "Male",   "Delhi"),
            ("Anjali Singh",   "Female", "Mumbai"),
            ("Vikram Patel",   "Male",   "Bangalore"),
            ("Sneha Reddy",    "Female", "Hyderabad"),
            ("Arjun Mehta",    "Male",   "Mumbai"),
            ("Kavya Nair",     "Female", "Chennai"),
            ("Rohit Gupta",    "Male",   "Pune"),
            ("Meera Joshi",    "Female", "Delhi"),
            ("Suresh Kumar",   "Male",   "Bangalore"),
        ]
        cursor.executemany(
            "INSERT INTO customers (name, gender, location) VALUES (?, ?, ?)",
            sample_customers
        )
        logger.info("Database seeded with %d sample customers.", len(sample_customers))

    conn.commit()
    conn.close()


# ── Groq LLM helper ───────────────────────────────────────────────────────────
GROQ_API_KEY = os.getenv("GROQ_API_KEY")

SYSTEM_PROMPT = """You are an expert SQL assistant. 
You have access to a SQLite database with ONE table called 'customers' that has these columns:
  - customer_id  INTEGER  (primary key, auto-increment)
  - name         TEXT
  - gender       TEXT     (values: 'Male' or 'Female')
  - location     TEXT

When the user asks a natural-language question about customers, respond with ONLY a valid SQLite SELECT query — no explanation, no markdown fences, no extra text.

Rules:
- Always use SELECT (never INSERT / UPDATE / DELETE / DROP).
- Use LIKE with % for partial name/location matches.
- gender comparisons should be case-insensitive (use LOWER()).
- If the question is not about customers or cannot be answered with the schema, reply exactly: INVALID_QUERY
"""

def generate_sql(user_query: str) -> str:
    """Send user query to Groq LLM and return the SQL it generates."""
    if not GROQ_API_KEY:
        raise HTTPException(status_code=500, detail="GROQ_API_KEY not set in environment.")

    client = Groq(api_key=GROQ_API_KEY)

    logger.info("Sending query to Groq LLM: %s", user_query)

    response = client.chat.completions.create(
        model=os.getenv("GROQ_MODEL", "llama-3.1-8b-instant"),
        messages=[
            {"role": "system", "content": SYSTEM_PROMPT},
            {"role": "user",   "content": user_query},
        ],
        temperature=0,      # deterministic SQL generation
        max_tokens=256,
    )

    sql = response.choices[0].message.content.strip()
    logger.info("LLM generated SQL: %s", sql)
    return sql


def is_safe_sql(sql: str) -> bool:
    """Basic safety check — only allow SELECT statements."""
    # Strip comments and normalise whitespace
    cleaned = re.sub(r"--[^\n]*", "", sql)
    cleaned = re.sub(r"/\*.*?\*/", "", cleaned, flags=re.DOTALL)
    first_token = cleaned.strip().split()[0].upper()
    return first_token == "SELECT"


# ── Request / Response models ─────────────────────────────────────────────────
class QueryRequest(BaseModel):
    query: str

    class Config:
        json_schema_extra = {"example": {"query": "Show me all female customers from Mumbai"}}


# ── API Token check (optional but included for bonus points) ──────────────────
API_TOKEN = os.getenv("API_TOKEN", "")

def verify_token(x_api_token: str | None = None):
    """If API_TOKEN is set in .env, enforce it; otherwise skip."""
    if API_TOKEN and x_api_token != API_TOKEN:
        raise HTTPException(status_code=401, detail="Invalid or missing API token.")


# ── Routes ────────────────────────────────────────────────────────────────────
@app.on_event("startup")
def startup_event():
    init_db()
    logger.info("Application started. Database ready.")


@app.get("/")
def root():
    return {"message": "LLM Chatbot API is running 🚀"}


@app.get("/customers")
def list_all_customers(conn: sqlite3.Connection = Depends(get_db)):
    """Helper endpoint — returns all customers (useful for testing)."""
    rows = conn.execute("SELECT * FROM customers").fetchall()
    return [dict(r) for r in rows]


@app.post("/chat")
def chat(
    request: QueryRequest,
    conn: sqlite3.Connection = Depends(get_db),
):
    user_query = request.query.strip()
    if not user_query:
        raise HTTPException(status_code=400, detail="Query cannot be empty.")

    logger.info("Received user query: %s", user_query)

    # 1. Generate SQL via LLM
    try:
        sql = generate_sql(user_query)
    except Exception as e:
        logger.error("LLM error: %s", str(e))
        raise HTTPException(status_code=502, detail=f"LLM error: {str(e)}")

    # 2. Handle INVALID_QUERY signal from LLM
    if sql == "INVALID_QUERY":
        return {
            "user_query": user_query,
            "sql_query": None,
            "results": [],
            "message": "I can only answer questions about customers in the database. Please try again.",
        }

    # 3. Safety check
    if not is_safe_sql(sql):
        logger.warning("Unsafe SQL blocked: %s", sql)
        raise HTTPException(status_code=400, detail="Generated SQL was not a SELECT statement. Blocked for safety.")

    # 4. Execute SQL
    try:
        rows = conn.execute(sql).fetchall()
        results = [dict(r) for r in rows]
        logger.info("Query returned %d rows.", len(results))
    except sqlite3.Error as e:
        logger.error("SQL execution error: %s | SQL: %s", str(e), sql)
        raise HTTPException(status_code=400, detail=f"SQL error: {str(e)}")

    return {
        "user_query": user_query,
        "sql_query": sql,
        "results": results,
        "message": f"Found {len(results)} result(s).",
    }