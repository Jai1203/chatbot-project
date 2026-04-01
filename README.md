\# LLM-Powered Customer Chatbot



A full-stack chatbot that lets you query a customer database using plain English.

Type "Show me all female customers from Mumbai" and the AI converts it to SQL and shows results.



\*\*Stack:\*\* FastAPI · SQLite · Groq (Llama 3.1) · ReactJS



\## Setup Instructions



\### Prerequisites

\- Python 3.11+

\- Node.js 18+

\- Groq API key (free) from https://console.groq.com



\### Backend Setup

cd backend

python -m venv venv

venv\\Scripts\\activate

pip install -r requirements.txt

copy .env.example .env

(Add your Groq API key inside .env)

python seed\_db.py

uvicorn main:app --reload --port 8000



\### Frontend Setup (new terminal)

cd frontend

npm install

npm start



Open http://localhost:3000



\## Example Queries

\- Show me all female customers from Mumbai

\- List all customers from Delhi

\- How many male customers are there?

\- List all customers



\## API Endpoints

\- POST /chat — send natural language query

\- GET /customers — list all customers

\- GET /docs — interactive API documentation

