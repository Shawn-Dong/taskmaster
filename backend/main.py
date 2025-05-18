"""
TaskMaster API - FastAPI Backend

This serves as both a working implementation and a learning source
"""

from fastapi import FastAPI, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Optional
from datetime import date, datetime
import json

from database import get_db_connection, init_db

#Create a FastAPI application instance
app = FastAPI(title="TaskMaster API", description="A simple task management API")
init_db()

# === CORS Configuration ===
# CORS (Cross-Origin Resource Sharing) allows the frontend (running on a different domain/port)
# to make requests to this API. Without this, the browser would block requests from your React app.
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# === Pydantic Models ===
# These models define the shape of the data that the API expects and returns
# They also handle validation to ensure the data meets certain criteria

class TaskBase(BaseModel):
     """
     Base model for a task with common fields.
     Foundation for other task-related models.
     """
     title: str
     description: Optional[str] = None
     due_date: Optional[str] = None
     priority: Optional[str] = 1

# === Input Models ===
class TaskCreate(TaskBase):
    """
    Model for creating a new task.
    Inherits all fields from TaskBase.
    """
    pass

class TaskUpdate(BaseModel):
    """
    Model for updating an existing task.
    All fields are optional since updates can be partial.
    """
    title: Optional[str] = None
    description: Optional[str] = None
    due_date: Optional[str] = None
    priority: Optional[int] = None
    is_completed: Optional[bool] = None

# === Output Models ===
class Task(TaskBase):
    """
    Complete task model including all fields.
    Used for responses to ensure a consistent format.
    """
    id: int  # Included in responses but not in requests
    is_completed: bool
    class Config:
        """
        Configuration for the Task model.
        orm_mode allows the model to work with ORM objects.
        Lets a Pydantic model read data from objects that aren't dictionaries.
        Allows Pydantic to:
        Read data directly from database ORM models (like SQLAlchemy models)
        Access attributes instead of using dictionary keys
        """
        orm_mode = True

class TaskStats(BaseModel):
    """
    Model for task statistics.
    Used for the /stats/ endpoint response.
    """
    total: int
    completed: int
    pending: int

# === API Endpoints ===
@app.post("/tasks/", response_model=Task, status_code=status.HTTP_201_CREATED)
def create_task(task: TaskCreate):
    """
    Create a new task endpoint.

    Accepts a task object without an ID and returns the created task with an ID.
    The status code 201 (Created) is returned on success.
    """
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute(
        "INSERT INTO tasks (title, description, due_date, priority) VALUES (?, ?, ?, ?)",
        (task.title, task.description, task.due_date, task.priority)
    )
    conn.commit()
    task_id = cursor.lastrowid
    conn.close()
    return {
        "id": task_id, 
        "title": task.title, 
        "description": task.description, 
        "due_date": task.due_date, 
        "priority": task.priority, 
        "is_completed": False
    }

@app.get("/tasks/", response_model=List[Task])
def read_tasks():
    conn = get_db_connection()
    tasks = conn.execute("SELECT * FROM tasks").fetchall()
    conn.close()
    #Convert the rows to dics and handle boolean conversion
    taskList = []
    for item in tasks:
        task_dict = dict(item)
        task_dict["is_completed"] =bool(task_dict["is_completed"])
        taskList.append(task_dict)
    return taskList


