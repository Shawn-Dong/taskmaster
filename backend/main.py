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
    """
    Get all tasks endpoint and return a list of tasks
    Returns a list of all tasks in the database.
    """
    conn = get_db_connection()
    tasks = conn.execute("SELECT * FROM tasks").fetchall()
    conn.close()

    #Convert the rows to dics and handle boolean conversion
    taskList = []
    for task in tasks:
        task_dict = dict(task)
        task_dict["is_completed"] =bool(task_dict["is_completed"])
        taskList.append(task_dict)

    return taskList

@app.get("/tasks/{task_id}", response_model=Task)
def read_task(task_id: int):
    """
    Get a specific task by ID endpoint.
    Returns a single task or raises a 404 error if Task DNE
    """
    conn = get_db_connection()
    task = conn.execute("SELECT * FROM tasks WHERE id = ?", (task_id)).fetchone()
    conn.close()

    if task is None:
        raise HTTPException(status_code=404, detail="Task not found")
    
    task_dict = dict(task)
    task_dict["is_completed"] = bool(task_dict["is_completed"])
    return task_dict
    
@app.put("/tasks/{task_id}", response_model=Task)
def update_task(task_id:int, task: TaskUpdate):
    """
    Update a task endpoint.
    Accepts a task object with fields to update and returns the updated task.
    Only fields that are provided will be updated.
    """
    conn = get_db_connection()
    existing_task = conn.execute("SELECT * FROM tasks WHERE id = ?",(task_id,)).fetchone()
    if existing_task is None:
        conn.close()
        raise HTTPException(status_code=404, detail="Task not found")
    existing_task_dict = dict(existing_task)

    if hasattr(task, "model_dump"):
        task_data = task.model_dump()
    else:
        task_data = task.dict()

    update_data = {k: v for k, v in task_data.items() if v is not None}

    if update_data:
        set_expressions = []
        for key in update_data.keys():
            expression = f"{key} = ?"
            set_expressions.append(expression)
        set_values = ", ".join(set_expressions)

        if "is_completed" in update_data:
            update_data["is_completed"] = 1 if update_data["is_completed"] else 0
        values = list(update_data.values())
        values.append(task_id)

        # Execute the update query
        conn.execute(f"UPDATE tasks SET {set_values} WHERE id = ?", values)
        conn.commit()

    # Get the updated task
    updated_task = conn.execute("SELECT * FROM tasks WHERE id = ?", (task_id,)).fetchone()
    conn.close()

    # Convert the row to a dictionary and handle boolean conversion
    updated_task_dict = dict(updated_task)
    updated_task_dict["is_completed"] = bool(updated_task_dict["is_completed"])
    
    # Return the updated task, 
    return updated_task_dict

@app.delete("/tasks/{task_id}", status_code=status.HTTP_200_OK)
def delete_task(task_id: int):
    """
    Delete a task endpoint.
    Deletes a task by ID and returns a sucess message.
    """
    conn = get_db_connection()
    existing_task = conn.execute("SELECT * FROM tasks WHERE id = ?", (task_id,)).fetchone()
    if existing_task is None:
        conn.close()
        raise HTTPException(status_code=404, detail="Task not found")
    existing_task_dict = dict(existing_task)

    conn.execute("DELETE FROM tasks WHERE id = ?", (task_id,))
    conn.commit()
    conn.close()
    return{"message:" "Task deleted succesfully"}

@app.get("/stats/", response_model=TaskStats)
def get_task_stats():
    conn = get_db_connection()
    total = conn.execute("SELECT COUNT(*) FROM tasks").fetchone()[0]
    completed = conn.execute("SELECT COUNT(*) FROM tasks WHERE is_completeed = 1").fetchone()[0]
    pending = total - completed
    conn.close()
    return {"total": total, "completed": completed, "pending":pending}

@app.get("/")
def read_root():
    """
    Root endpoint
    Returns basic information about API
    """
    return{
     "name": "TaskMaster API",
     "version": "1.0.0",
     "description": "A simple task management API",
     "endpoints": {
          "GET /": "This information",
          "GET /tasks/": "Get all tasks",
          "POST /tasks/": "Create a new task",
          "GET /tasks/{id}": "Get a specific task",
          "PUT /tasks/{id}": "Update a task",
          "DELETE /tasks/{id}": "Delete a task",
          "GET /stats/": "Get task statistics"
          }
     }

