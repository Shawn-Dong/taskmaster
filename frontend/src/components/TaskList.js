import React from 'react';

function TaskList({ tasks, deleteTask, editTask, toggleComplete }) {
  // Sort tasks by priority (high to low)
  const sortedTasks = [...tasks].sort((a, b) => b.priority - a.priority);

  return (
    <div className="task-list">
      <h2>My Tasks</h2>
      
      {sortedTasks.length === 0 ? (
        <p>No tasks yet. Add a task to get started!</p>
      ) : (
        sortedTasks.map(task => (
          <div 
            key={task.id} 
            className={`task-item ${task.is_completed ? 'completed' : ''}`}
          >
            <div className="task-header">
              <h3>{task.title}</h3>
              <div className={`priority priority-${task.priority}`}>
                {task.priority === 3 ? 'High' : task.priority === 2 ? 'Medium' : 'Low'}
              </div>
            </div>
            
            {task.description && <p>{task.description}</p>}
            {task.due_date && <p>Due: {task.due_date}</p>}
            
            <div className="task-actions">
              <button onClick={() => toggleComplete(task.id, task.is_completed)}>
                {task.is_completed ? '✓ Mark Incomplete' : '☐ Mark Complete'}
              </button>
              <button onClick={() => editTask(task)}>Edit</button>
              <button onClick={() => deleteTask(task.id)}>Delete</button>
            </div>
          </div>
        ))
      )}
    </div>
  );
}

export default TaskList;