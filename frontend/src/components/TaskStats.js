import React from 'react';

function TaskStats({ stats }) {
  return (
    <div className="task-stats">
      <h2>Task Statistics</h2>
      <div className="stats-grid">
        <div className="stat-item">
          <h3>Total Tasks</h3>
          <p className="stat-value">{stats.total}</p>
        </div>
        <div className="stat-item">
          <h3>Completed</h3>
          <p className="stat-value completed">{stats.completed}</p>
        </div>
        <div className="stat-item">
          <h3>Pending</h3>
          <p className="stat-value pending">{stats.pending}</p>
        </div>
      </div>
    </div>
  );
}

export default TaskStats; 