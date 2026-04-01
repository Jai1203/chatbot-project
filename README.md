🚀 LLM-Powered Customer Chatbot
cd backend

python -m venv venv
venv\Scripts\activate   # (Windows)

pip install -r requirements.txt

copy .env.example .env
# Add your Groq API key inside .env

python seed_db.py

uvicorn main:app --reload --port 8000
🌐 Frontend Setup

Open a new terminal:

cd frontend

npm install
npm start

👉 Visit: http://localhost:3000

💡 Try These Queries

Test the chatbot with:

"Show me all female customers from Mumbai"
"List all customers from Delhi"
"How many male customers are there?"
"List all customers"
🔌 API Endpoints
Method	Endpoint	Description
POST	/chat	Send natural language query
GET	/customers	Fetch all customers
GET	/docs	Swagger API documentation
🧠 How It Works
User enters a natural language query
LLM converts it → SQL query
Backend executes query on SQLite
Results sent back → displayed in UI
🚀 Future Improvements
🔐 Authentication & user roles
📊 Data visualization dashboards
🧾 Query history tracking
🌍 Multi-database support (PostgreSQL, MySQL)
🧠 Smarter prompt engineering for complex queries
💥 Why This Matters

This project demonstrates a real-world use case of LLMs in:

Data accessibility
Business intelligence
Developer productivity

It’s not just a chatbot — it’s a natural language interface for databases.
