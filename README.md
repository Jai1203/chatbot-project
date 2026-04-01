⚡ LLM-Powered Customer Chatbot

Turn plain English into powerful database queries — instantly.

Stop writing SQL. Just ask.

💬 “Show me all female customers from Mumbai”
⚙️ AI converts it → SQL query
📊 Results appear instantly in your UI

🌐 Live Demo

🚀 Try it yourself:

🌍 Frontend: https://chatbot-project-plum-iota.vercel.app
⚙️ Backend API: https://chatbot-backend-e6ss.onrender.com
📚 API Docs (Swagger): https://chatbot-backend-e6ss.onrender.com/docs
✨ What Makes This Cool

This isn’t just a chatbot — it’s a natural language interface for databases.

🧠 Converts human language → SQL using LLMs
⚡ Ultra-fast inference powered by Groq (Llama 3.1)
🔍 Real-time query execution on structured data
💻 Clean and interactive React frontend
🛡️ Built-in safeguards against unsafe queries
🧱 Tech Stack
Layer	Technology
Frontend	ReactJS
Backend	FastAPI (Python)
Database	SQLite3
AI/LLM	Groq API (Llama 3.1 8B)
Deployment	Vercel (Frontend) + Render (Backend)
🧠 How It Works
User enters a query in plain English
            ↓
React frontend sends request to FastAPI
            ↓
Backend forwards query to Groq LLM
            ↓
LLM converts English → SQL
            ↓
SQL runs on SQLite database
            ↓
Results returned and displayed in UI

Simple on the surface — powerful underneath.

🗄️ Database Schema
CREATE TABLE customers (
    customer_id INTEGER PRIMARY KEY AUTOINCREMENT,
    name        TEXT NOT NULL,
    gender      TEXT NOT NULL,
    location    TEXT NOT NULL
);

📊 Includes sample data across major Indian cities like Mumbai, Delhi, Bangalore, Hyderabad, Chennai, and Pune.

💬 Example Queries
💡 Query	🔍 What it does
Show me all female customers from Mumbai	Filters by gender + location
List all customers from Delhi	Filters by location
How many male customers are there?	Performs COUNT aggregation
Show customers from Bangalore	Location-based filtering
List all customers	Returns full dataset
🔌 API Reference
📨 POST /chat

Send a natural language query.

Request

{
  "query": "Show me all female customers from Mumbai"
}

Response

{
  "user_query": "Show me all female customers from Mumbai",
  "sql_query": "SELECT * FROM customers WHERE LOWER(gender) = 'female' AND location LIKE '%Mumbai%'",
  "results": [
    { "customer_id": 1, "name": "Priya Sharma", "gender": "Female", "location": "Mumbai" }
  ],
  "message": "Found 2 result(s)."
}
📄 GET /customers

Returns all customer records.

📘 GET /docs

Interactive Swagger documentation for testing endpoints.

🚀 Run Locally
🔑 Prerequisites
Python 3.11+
Node.js 18+
Groq API Key → https://console.groq.com
🖥 Backend Setup
cd backend

python -m venv venv
venv\Scripts\activate

pip install -r requirements.txt

cp .env.example .env
# Add your GROQ_API_KEY

python seed_db.py

uvicorn main:app --reload --port 8000
🌐 Frontend Setup
cd frontend

npm install
npm start

👉 Open: http://localhost:3000

📁 Project Structure
chatbot-project/
├── backend/
│   ├── main.py
│   ├── seed_db.py
│   ├── requirements.txt
│   └── .env.example
└── frontend/
    ├── public/
    └── src/
        ├── index.js
        └── App.js
✅ Features
✅ Natural Language → SQL using LLM
✅ FastAPI backend with auto-generated docs
✅ SQLite database with seeded data
✅ React UI with example query prompts
✅ Query logging + SQL visibility
✅ Error handling for invalid inputs
✅ Environment-based API key management
✅ SQL injection protection (SELECT-only execution)
✅ Fully deployed (Vercel + Render)
⚠️ Note on Free Hosting

The backend runs on Render’s free tier:

💤 Goes idle after ~15 minutes
⏳ First request may take 30–60 seconds
⚡ After that, responses are fast
🚀 What This Project Demonstrates
Real-world application of LLMs in backend systems
Bridging the gap between non-technical users and databases
Full-stack development with AI integration
Clean architecture + production-style deployment
