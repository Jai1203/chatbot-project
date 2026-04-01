"""
seed_db.py – Run this once to create and populate the SQLite database.
Usage:  python seed_db.py
"""
import sqlite3
import os
from dotenv import load_dotenv

load_dotenv()
DB_PATH = os.getenv("DB_PATH", "customers.db")

conn = sqlite3.connect(DB_PATH)
cursor = conn.cursor()

cursor.execute("DROP TABLE IF EXISTS customers")
cursor.execute("""
    CREATE TABLE customers (
        customer_id INTEGER PRIMARY KEY AUTOINCREMENT,
        name        TEXT    NOT NULL,
        gender      TEXT    NOT NULL,
        location    TEXT    NOT NULL
    )
""")

customers = [
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
    customers
)

conn.commit()
conn.close()

print(f"✅  Database '{DB_PATH}' created and seeded with {len(customers)} customers.")