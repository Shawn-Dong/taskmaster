from fastapi import APIRouter, HTTPException, status
from typing import List
from dto.task import Task, TaskCreate, TaskUpdate
from service.task_service import (
    create_task_service, get_task_service, get_all_tasks_service, update_task_service, delete_task_service
)

router = APIRouter(prefix="/tasks", tags=["tasks"])

@router.post("/", response_model=Task, status_code=status.HTTP_201_CREATED)
def create_task(task: TaskCreate):
    return create_task_service(task)

@router.get("/", response_model=List[Task])
def read_tasks():
    return get_all_tasks_service()

@router.get("/{task_id}", response_model=Task)
def read_task(task_id: int):
    task = get_task_service(task_id)
    if not task:
        raise HTTPException(status_code=404, detail="Task not found")
    return task

@router.put("/{task_id}", response_model=Task)
def update_task(task_id: int, task: TaskUpdate):
    updated_task = update_task_service(task_id, task)
    if not updated_task:
        raise HTTPException(status_code=404, detail="Task not found")
    return updated_task

@router.delete("/{task_id}", status_code=status.HTTP_200_OK)
def delete_task(task_id: int):
    success = delete_task_service(task_id)
    if not success:
        raise HTTPException(status_code=404, detail="Task not found")
    return {"message": "Task deleted successfully"}

