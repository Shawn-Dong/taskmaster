from pydantic import BaseModel
from typing import List, Optional

class TaskBase(BaseModel):
    """
    Base model for a task with common fields.
    Foundation for other task-related models.
    """
    title: str
    description: Optional[str] = None
    due_date: Optional[str] = None
    priority: Optional[int] = 1

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

class Task(TaskBase):
    """
    Complete task model including all fields.
    Used for responses to ensure a consistent format.
    """
    id: int  # Included in responses but not in requests
    is_completed: bool
    class Config:
        orm_mode = True

class TaskStats(BaseModel):
    """
    Model for task statistics.
    Used for the /stats/ endpoint response.
    """
    total: int
    completed: int
    pending: int
