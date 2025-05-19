from persistence.database import get_db_connection

def create_task_db(task_data):
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute(
        "INSERT INTO tasks (title, description, due_date, priority) VALUES (?, ?, ?, ?)",
        (task_data['title'], task_data.get('description'), task_data.get('due_date'), task_data.get('priority'))
    )
    conn.commit()
    task_id = cursor.lastrowid
    conn.close()
    return task_id

def get_task_db(task_id):
    conn = get_db_connection()
    task = conn.execute("SELECT * FROM tasks WHERE id = ?", (task_id,)).fetchone()
    conn.close()
    return dict(task) if task else None

def get_all_tasks_db():
    conn = get_db_connection()
    tasks = conn.execute("SELECT * FROM tasks").fetchall()
    conn.close()
    return [dict(task) for task in tasks]

def update_task_db(task_id, update_data):
    conn = get_db_connection()
    existing_task = conn.execute("SELECT * FROM tasks WHERE id = ?", (task_id,)).fetchone()
    if not existing_task:
        conn.close()
        return None
    set_expressions = []
    values = []
    for key, value in update_data.items():
        set_expressions.append(f"{key} = ?")
        values.append(value)
    if not set_expressions:
        conn.close()
        return dict(existing_task)
    values.append(task_id)
    conn.execute(f"UPDATE tasks SET {', '.join(set_expressions)} WHERE id = ?", values)
    conn.commit()
    updated_task = conn.execute("SELECT * FROM tasks WHERE id = ?", (task_id,)).fetchone()
    conn.close()
    return dict(updated_task)

def delete_task_db(task_id):
    conn = get_db_connection()
    existing_task = conn.execute("SELECT * FROM tasks WHERE id = ?", (task_id,)).fetchone()
    if not existing_task:
        conn.close()
        return False
    conn.execute("DELETE FROM tasks WHERE id = ?", (task_id,))
    conn.commit()
    conn.close()
    return True

def get_stats_db():
    conn = get_db_connection()
    total = conn.execute("SELECT COUNT(*) FROM tasks").fetchone()[0]
    completed = conn.execute("SELECT COUNT(*) FROM tasks WHERE is_completed = 1").fetchone()[0]
    pending = total - completed
    conn.close()
    return {"total": total, "completed": completed, "pending": pending}
