"""
TaskMaster API - Database Setup

This file handles the SQLite database connection setup for the TaskMaster API.
Provides functions to establish database connections and initialize the database.
"""

import sqlite3
import os
from pathlib import Path

#Define the database file path, the database will be created in the same dir as the script
DATABASE_PATH = Path(__file__).parent / "taskmaster.db"

def get_db_connection():
     """
     Creates and returns a connection to the SQLite database.
     
     The row_factory setting allows us to access columns by name
     (like a dictionary) instead of by index.

     Returns:
     sqlite3.Connection: A connection to the SQLite database
     """
     conn = sqlite3.connect(str(DATABASE_PATH))

     # Configure the connection to return rows as dictionaries
     conn.row_factory = sqlite3.Row

     return conn

def init_db():
     """
     Initializees the db by creating tasks table if it DNE

     Called when the app starts to ensure proper set up of the DB
     """

     # Check if the database directory exists and create if not
     # if exist_ok=True then nothing happens
     os.makedirs(DATABASE_PATH.parent, exist_ok=True)
     conn = get_db_connection
     conn.execute('''
     CREATE TABLE IF NOT EXISTS tasks (
          id INTEGER PRIMARY KEY AUTOINCREMENT,  -- Unique identifier for each task, auto-incremented
          title TEXT NOT NULL,                   -- Task title (required)
          description TEXT,                      -- Task description (optional)
          due_date TEXT,                         -- Due date in text format (optional)
          priority INTEGER DEFAULT 1,            -- Priority level (1=Low, 2=Medium, 3=High)
          is_completed BOOLEAN DEFAULT 0         -- Completion status (0=False, 1=True)
     )
     ''')
     conn.commit()
     conn.close()
     print(f"Database initialized at:{DATABASE_PATH}")

# This allows running this script directly to initialize the database
if __name__ == "__main__":
    init_db()
    print("Database setup complete. You can now run the TaskMaster API.")
