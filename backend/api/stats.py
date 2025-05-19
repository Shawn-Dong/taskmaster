from fastapi import APIRouter
from service.task_service import get_stats_service
from dto.task import TaskStats

router = APIRouter(tags=["stats"])

@router.get("/stats/", response_model=TaskStats)
def get_stats():
    return get_stats_service()

def root_info():
    return {
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
