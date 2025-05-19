"use client";

import React, { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, Calendar, Flag, CheckCircle, Circle, BarChart3 } from 'lucide-react';

// Types based on the OpenAPI schema
interface Task {
  id: number;
  title: string;
  description?: string;
  due_date?: string;
  priority?: number;
  is_completed: boolean;
}

interface TaskCreate {
  title: string;
  description?: string;
  due_date?: string;
  priority?: number;
}

interface TaskUpdate {
  title?: string;
  description?: string;
  due_date?: string;
  priority?: number;
  is_completed?: boolean;
}

interface TaskStats {
  total: number;
  completed: number;
  pending: number;
}

const API_BASE_URL = 'http://localhost:8000'; // Adjust this to your actual API URL

export default function TaskMasterApp() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [stats, setStats] = useState<TaskStats | null>(null);
  const [isAddingTask, setIsAddingTask] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>('');
  const [showStats, setShowStats] = useState(false);
  const [apiConnected, setApiConnected] = useState<boolean | null>(null);

  // API Functions
  const fetchTasks = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/tasks/`);
      if (!response.ok) throw new Error('Failed to fetch tasks');
      const data = await response.json();
      setTasks(data);
      setApiConnected(true);
      setError('');
    } catch (err) {
      setError('Cannot connect to API. Make sure your backend server is running at ' + API_BASE_URL);
      setApiConnected(false);
      console.error(err);
    }
  };

  const fetchStats = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/stats/`);
      if (!response.ok) throw new Error('Failed to fetch stats');
      const data = await response.json();
      setStats(data);
    } catch (err) {
      console.error('Error fetching stats:', err);
      // Set default stats if API is not available
      setStats({ total: 0, completed: 0, pending: 0 });
    }
  };

  const createTask = async (taskData: TaskCreate) => {
    try {
      const response = await fetch(`${API_BASE_URL}/tasks/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(taskData),
      });
      if (!response.ok) throw new Error('Failed to create task');
      const newTask = await response.json();
      setTasks(prev => [...prev, newTask]);
      fetchStats();
    } catch (err) {
      setError('Error creating task');
      console.error(err);
    }
  };

  const updateTask = async (taskId: number, taskData: TaskUpdate) => {
    try {
      const response = await fetch(`${API_BASE_URL}/tasks/${taskId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(taskData),
      });
      if (!response.ok) throw new Error('Failed to update task');
      const updatedTask = await response.json();
      setTasks(prev => prev.map(task => task.id === taskId ? updatedTask : task));
      fetchStats();
    } catch (err) {
      setError('Error updating task');
      console.error(err);
    }
  };

  const deleteTask = async (taskId: number) => {
    try {
      const response = await fetch(`${API_BASE_URL}/tasks/${taskId}`, {
        method: 'DELETE',
      });
      if (!response.ok) throw new Error('Failed to delete task');
      setTasks(prev => prev.filter(task => task.id !== taskId));
      fetchStats();
    } catch (err) {
      setError('Error deleting task');
      console.error(err);
    }
  };

  const toggleTaskCompletion = async (task: Task) => {
    await updateTask(task.id, { is_completed: !task.is_completed });
  };

  // Load initial data
  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      await Promise.all([fetchTasks(), fetchStats()]);
      setLoading(false);
    };
    loadData();
  }, []);

  // Priority colors
  const getPriorityColor = (priority?: number) => {
    if (!priority) return 'bg-gray-100 text-gray-600';
    if (priority >= 5) return 'bg-red-100 text-red-600';
    if (priority >= 3) return 'bg-yellow-100 text-yellow-600';
    return 'bg-green-100 text-green-600';
  };

  const getPriorityText = (priority?: number) => {
    if (!priority) return 'No Priority';
    if (priority >= 5) return 'High';
    if (priority >= 3) return 'Medium';
    return 'Low';
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-lg text-gray-600">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <h1 className="text-3xl font-bold text-gray-800">TaskMaster</h1>
            <div className="flex gap-3">
              <button
                onClick={() => setShowStats(!showStats)}
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <BarChart3 size={18} />
                {showStats ? 'Hide Stats' : 'Show Stats'}
              </button>
              <button
                onClick={() => setIsAddingTask(true)}
                className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
              >
                <Plus size={18} />
                Add Task
              </button>
            </div>
          </div>

          {error && (
            <div className="mt-4 p-4 bg-red-100 border border-red-300 rounded-lg text-red-700">
              <div className="font-medium">Connection Error</div>
              <div className="text-sm mt-1">{error}</div>
              {apiConnected === false && (
                <div className="text-sm mt-2">
                  <strong>To fix this:</strong>
                  <ol className="list-decimal list-inside mt-1 space-y-1">
                    <li>Make sure your FastAPI backend is running on port 8000</li>
                    <li>Check that CORS is configured to allow localhost:3000</li>
                    <li>Verify the API_BASE_URL in the component matches your backend</li>
                  </ol>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Stats Panel */}
        {showStats && stats && (
          <div className="mb-8 grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-white p-6 rounded-lg shadow-sm border">
              <div className="text-2xl font-bold text-blue-600">{stats.total}</div>
              <div className="text-gray-600">Total Tasks</div>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-sm border">
              <div className="text-2xl font-bold text-green-600">{stats.completed}</div>
              <div className="text-gray-600">Completed</div>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-sm border">
              <div className="text-2xl font-bold text-orange-600">{stats.pending}</div>
              <div className="text-gray-600">Pending</div>
            </div>
          </div>
        )}

        {/* Task Form Modal */}
        {(isAddingTask || editingTask) && (
          <TaskForm
            task={editingTask}
            onSave={async (taskData) => {
              if (editingTask) {
                await updateTask(editingTask.id, taskData);
                setEditingTask(null);
              } else {
                await createTask(taskData);
                setIsAddingTask(false);
              }
            }}
            onCancel={() => {
              setIsAddingTask(false);
              setEditingTask(null);
            }}
          />
        )}

        {/* Task List */}
        <div className="bg-white rounded-lg shadow-sm border">
          <div className="p-6 border-b">
            <h2 className="text-xl font-semibold text-gray-800">Tasks</h2>
          </div>
          
          {tasks.length === 0 ? (
            <div className="p-8 text-center text-gray-500">
              No tasks yet. Create your first task to get started!
            </div>
          ) : (
            <div className="divide-y">
              {tasks.map((task) => (
                <TaskItem
                  key={task.id}
                  task={task}
                  onToggleComplete={() => toggleTaskCompletion(task)}
                  onEdit={() => setEditingTask(task)}
                  onDelete={() => deleteTask(task.id)}
                  getPriorityColor={getPriorityColor}
                  getPriorityText={getPriorityText}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// Task Form Component
function TaskForm({ 
  task, 
  onSave, 
  onCancel 
}: {
  task?: Task | null;
  onSave: (taskData: TaskCreate | TaskUpdate) => Promise<void>;
  onCancel: () => void;
}) {
  const [formData, setFormData] = useState({
    title: task?.title || '',
    description: task?.description || '',
    due_date: task?.due_date || '',
    priority: task?.priority || 1,
  });

  const handleSubmit = async () => {
    if (!formData.title.trim()) return;
    
    const taskData = {
      ...formData,
      description: formData.description || undefined,
      due_date: formData.due_date || undefined,
    };
    await onSave(taskData);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-md">
        <div className="p-6 border-b">
          <h3 className="text-lg font-semibold">
            {task ? 'Edit Task' : 'Add New Task'}
          </h3>
        </div>

        <div className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Title *
            </label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
              className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Enter task title"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Description
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
              rows={3}
              placeholder="Enter task description (optional)"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Due Date
            </label>
            <input
              type="date"
              value={formData.due_date}
              onChange={(e) => setFormData(prev => ({ ...prev, due_date: e.target.value }))}
              className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Priority
            </label>
            <select
              value={formData.priority}
              onChange={(e) => setFormData(prev => ({ ...prev, priority: parseInt(e.target.value) }))}
              className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value={1}>Low (1)</option>
              <option value={2}>Low (2)</option>
              <option value={3}>Medium (3)</option>
              <option value={4}>Medium (4)</option>
              <option value={5}>High (5)</option>
              <option value={6}>High (6)</option>
              <option value={7}>Urgent (7)</option>
              <option value={8}>Urgent (8)</option>
              <option value={9}>Critical (9)</option>
              <option value={10}>Critical (10)</option>
            </select>
          </div>

          <div className="flex gap-3 pt-4">
            <button
              onClick={handleSubmit}
              disabled={!formData.title.trim()}
              className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
            >
              {task ? 'Update' : 'Create'} Task
            </button>
            <button
              onClick={onCancel}
              className="flex-1 px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400 transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// Task Item Component
function TaskItem({ 
  task, 
  onToggleComplete, 
  onEdit, 
  onDelete,
  getPriorityColor,
  getPriorityText 
}: {
  task: Task;
  onToggleComplete: () => void;
  onEdit: () => void;
  onDelete: () => void;
  getPriorityColor: (priority?: number) => string;
  getPriorityText: (priority?: number) => string;
}) {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric', 
      year: 'numeric' 
    });
  };

  return (
    <div className={`p-4 hover:bg-gray-50 transition-colors ${task.is_completed ? 'opacity-75' : ''}`}>
      <div className="flex items-start gap-3">
        <button
          onClick={onToggleComplete}
          className="mt-1 text-gray-400 hover:text-blue-600 transition-colors"
        >
          {task.is_completed ? (
            <CheckCircle size={20} className="text-green-600" />
          ) : (
            <Circle size={20} />
          )}
        </button>

        <div className="flex-1 min-w-0">
          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2">
            <div className="flex-1">
              <h3 className={`font-medium ${task.is_completed ? 'line-through text-gray-500' : 'text-gray-900'}`}>
                {task.title}
              </h3>
              {task.description && (
                <p className={`text-sm mt-1 ${task.is_completed ? 'text-gray-400' : 'text-gray-600'}`}>
                  {task.description}
                </p>
              )}
            </div>

            <div className="flex items-center gap-2">
              {task.due_date && (
                <span className="flex items-center gap-1 text-xs px-2 py-1 bg-blue-100 text-blue-700 rounded">
                  <Calendar size={12} />
                  {formatDate(task.due_date)}
                </span>
              )}
              
              <span className={`flex items-center gap-1 text-xs px-2 py-1 rounded ${getPriorityColor(task.priority)}`}>
                <Flag size={12} />
                {getPriorityText(task.priority)}
              </span>

              <div className="flex gap-1">
                <button
                  onClick={onEdit}
                  className="p-1 text-gray-400 hover:text-blue-600 transition-colors"
                  title="Edit task"
                >
                  <Edit2 size={16} />
                </button>

                <button
                  onClick={onDelete}
                  className="p-1 text-gray-400 hover:text-red-600 transition-colors"
                  title="Delete task"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}