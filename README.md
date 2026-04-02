# LLM-Powered Customer Chatbot

A full-stack AI chatbot that converts plain English questions into SQL queries and fetches results from a customer database.

## Live Demo

- Frontend: https://chatbot-project-plum-iota.vercel.app
- Backend API: https://chatbot-backend-e6ss.onrender.com
- API Docs: https://chatbot-backend-e6ss.onrender.com/docs

## Tech Stack

- Frontend: ReactJS
- Backend: FastAPI (Python)
- Database: SQLite3
- AI Model: Groq API with Llama 3.1 8B
- Hosting: Vercel + Render

## Data Flow
```
User enters query (natural language)
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
Results returned to UI
```

## Project Structure
```
chatbot-project/
├── backend/
│   ├── main.py
│   ├── seed_db.py
│   ├── requirements.txt
│   └── .env.example
└── frontend/
    ├── public/
    │   └── index.html
    └── src/
        ├── index.js
        └── App.js
```

## Local Setup

### Prerequisites
- Python 3.11+
- Node.js 18+
- Free Groq API key from https://console.groq.com

### Backend
```
cd backend
python -m venv venv
venv\Scripts\activate
pip install -r requirements.txt
copy .env.example .env
python seed_db.py
uvicorn main:app --reload --port 8000
```

### Frontend
```
cd frontend
npm install
npm start
```

Open http://localhost:3000

## Example Queries

- Show me all female customers from Mumbai
- List all customers from Delhi
- How many male customers are there?
- List all customers

## API Reference

### POST /chat

Request:
```
{
  "query": "Show me all female customers from Mumbai"
}
```

Response:
```
{
  "user_query": "Show me all female customers from Mumbai",
  "sql_query": "SELECT * FROM customers WHERE gender='Female' AND location LIKE '%Mumbai%'",
  "results": [...],
  "message": "Found 2 result(s)."
}
```

## Database Schema
```
CREATE TABLE customers (
    customer_id INTEGER PRIMARY KEY AUTOINCREMENT,
    name        TEXT NOT NULL,
    gender      TEXT NOT NULL,
    location    TEXT NOT NULL
);
```

## Features

- Natural language to SQL using Groq LLM
- FastAPI backend with automatic API docs
- SQLite database with 10 sample customers
- React frontend with example query chips
- Logging for all queries and generated SQL
- Error handling for invalid queries
- SQL injection protection (SELECT only)
- Deployed on Vercel and Render
