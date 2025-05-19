from dao.task_dao import (
    create_task_db, get_task_db, get_all_tasks_db, update_task_db, delete_task_db, get_stats_db
)
from dto.task import TaskCreate, TaskUpdate, Task, TaskStats

def create_task_service(task_create: TaskCreate) -> Task:
    task_data = task_create.dict()
    task_id = create_task_db(task_data)
    db_task = get_task_db(task_id)
    db_task["is_completed"] = bool(db_task["is_completed"]) if "is_completed" in db_task else False
    return Task(**db_task)

def get_task_service(task_id: int) -> Task:
    db_task = get_task_db(task_id)
    if not db_task:
        return None
    db_task["is_completed"] = bool(db_task["is_completed"])
    return Task(**db_task)

def get_all_tasks_service() -> list[Task]:
    db_tasks = get_all_tasks_db()
    tasks = []
    for db_task in db_tasks:
        db_task["is_completed"] = bool(db_task["is_completed"])
        tasks.append(Task(**db_task))
    return tasks

def update_task_service(task_id: int, task_update: TaskUpdate) -> Task:
    update_data = task_update.dict(exclude_unset=True)
    if "is_completed" in update_data:
        update_data["is_completed"] = 1 if update_data["is_completed"] else 0
    db_task = update_task_db(task_id, update_data)
    if not db_task:
        return None
    db_task["is_completed"] = bool(db_task["is_completed"])
    return Task(**db_task)

def delete_task_service(task_id: int) -> bool:
    return delete_task_db(task_id)

def get_stats_service() -> TaskStats:
    stats = get_stats_db()
    return TaskStats(**stats)
