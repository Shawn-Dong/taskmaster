import React, { useState, useEffect } from 'react';

function TaskForm({ addTask, updateTask, currentTask, isEditing, setIsEditing }) {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    due_date: '',
    priority: 1
  });

  // When curråentTask changes (for editing), update form data
  useEffect(() => {
    if (currentTask) {
      setFormData({
        title: currentTask.title || '',
        description: currentTask.description || '',
        due_date: currentTask.due_date || '',
        priority: currentTask.priority || 1
      });
    }
  }, [currentTask]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: name === "priority" ? Number(value) : value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (isEditing) {
      updateTask(currentTask.id, formData);
    } else {
      addTask(formData);
    }
    
    // Reset form
    setFormData({
      title: '',
      description: '',
      due_date: '',
      priority: 1
    });
  };

  const cancelEdit = () => {
    setIsEditing(false);
    setFormData({
      title: '',
      description: '',
      due_date: '',
      priority: 1
    });
  };

  return (
    <div className="task-form">
      <h2>{isEditing ? 'Edit Task' : 'Add New Task'}</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="title">Title</label>
          <input
            type="text"
            id="title"
            name="title"
            value={formData.title}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="description">Description</label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
          />
        </div>

        <div className="form-group">
          <label htmlFor="due_date">Due Date</label>
          <input
            type="date"
            id="due_date"
            name="due_date"
            value={formData.due_date}
            onChange={handleChange}
          />
        </div>

        <div className="form-group">
          <label htmlFor="priority">Priority</label>
          <select
            id="priority"
            name="priority"
            value={formData.priority}
            onChange={handleChange}
          >
            <option value={1}>Low</option>
            <option value={2}>Medium</option>
            <option value={3}>High</option>
          </select>
        </div>

        <div className="form-actions">
          <button type="submit">
            {isEditing ? 'Update Task' : 'Add Task'}
          </button>
          {isEditing && (
            <button type="button" onClick={cancelEdit}>
              Cancel
            </button>
          )}
        </div>
      </form>
    </div>
  );
}

export default TaskForm;