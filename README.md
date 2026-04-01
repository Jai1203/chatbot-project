⚡ **LLM-Powered Customer Chatbot**

A full-stack AI application that enables users to query a customer database using natural language.
The system converts plain English queries into SQL and returns results in real time.

This project focuses on LLM integration, backend query generation, and full-stack system design.

🌐 **Live Demo**
**Frontend**: https://chatbot-project-plum-iota.vercel.app
**Backend API**: https://chatbot-backend-e6ss.onrender.com
**API Docs**: https://chatbot-backend-e6ss.onrender.com/docs

🚀 **Features**
💬 Natural language to SQL conversion
🧠 LLM-powered query generation (Groq – Llama 3.1)
⚡ Real-time database querying
🖥 Clean React-based user interface
📊 SQL query visibility with results
🛡 Basic SQL injection protection (SELECT-only queries)
⚙️ Fully deployed frontend and backend

🧱 **Architecture****
**Frontend**  ReactJS
1) Handles user input and displays results
2) Communicates with backend via REST API
**Backend** FastAPI (Python)
1) Integrates with Groq LLM API
2) Converts natural language → SQL
3) Executes queries on SQLite database
**Database** SQLite3
1) Lightweight and pre-seeded with sample customer data


🔄**Data Flow**

**User enters query (natural language)
        ↓
React Frontend
        ↓
FastAPI Backend
        ↓
Groq LLM (Llama 3.1)
        ↓
SQL Query Generation
        ↓
SQLite Database Execution
        ↓
Results returned to UI**


🤖 **Core Logic**

1) User input is sent to the LLM with structured prompting
2) LLM generates a valid SQL query
3) Backend validates the query (only SELECT allowed)
4) Query is executed on the database
5) Results and generated SQL are returned together


🗄️ **Database Schema**
CREATE TABLE customers (
    customer_id INTEGER PRIMARY KEY AUTOINCREMENT,
    name        TEXT NOT NULL,
    gender      TEXT NOT NULL,
    location    TEXT NOT NULL
);

Sample data includes customers from multiple cities such as Mumbai, Delhi, Bangalore, Hyderabad, Chennai, and Pune.

💬 **Example Queries**
1) Show me all female customers from Mumbai
2) List all customers from Delhi
3) How many male customers are there?
4) Show customers from Bangalore
5) List all customers

   
🔌 **API Endpoints**
POST /chat

Converts natural language query into SQL and returns results.

Request:

{
  "query": "Show me all female customers from Mumbai"
}

Response:

{
  "user_query": "Show me all female customers from Mumbai",
  "sql_query": "SELECT * FROM customers WHERE LOWER(gender) = 'female' AND location LIKE '%Mumbai%'",
  "results": [],
  "message": "Found X result(s)."
}

GET /customers

Returns all customer records.

GET /docs

Interactive Swagger documentation.

🛠 **Local Setup**
**Prerequisites**

1) Python 3.11+
2) Node.js 18+
3) Groq API key

1️⃣ **Backend (FastAPI)**
cd backend

python -m venv venv
venv\Scripts\activate

pip install -r requirements.txt

cp .env.example .env

Add your GROQ_API_KEY in the .env file.

python seed_db.py
uvicorn main:app --reload --port 8000

Backend runs at:
http://127.0.0.1:8000

2️⃣ **Frontend (React)**
cd frontend

npm install
npm start

Frontend runs at:
http://localhost:3000

📁 **Project Structure**

**chatbot-project/
├── backend/
│   ├── main.py
│   ├── seed_db.py
│   ├── requirements.txt
│   └── .env.example
└── frontend/
    ├── public/
    └── src/
        ├── index.js
        └── App.js**
        
⚠️ **Notes**

1) Backend is hosted on Render’s free tier
2) First request after inactivity may take 30–60 seconds
3) Only SELECT queries are allowed for safety


🎯 **Project Goals**

1) Demonstrate real-world LLM integration in backend systems
2) Simplify database interaction using natural language
3) Build a clean full-stack application with production-style flow
4) Create a project suitable for interviews and technical discussions

👨‍💻 **Author**

Jai Chadha
Aspiring Software Engineer
Interested in Full-Stack Development, Machine Learning, and AI Systems

✅ **GIT COMMANDS (COPY–PASTE)**

git status
git add README.md
git commit -m "Refactor README with clean structure and improved clarity"
git push
