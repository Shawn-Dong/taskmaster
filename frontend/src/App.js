import React, { useState, useEffect} from 'react';
import TaskList from './components/TaskList';
import TaskForm from './components/TaskForm';
import StatisticsPage from './components/StatisticsPage';
import './App.css';

function App(){
     const [tasks, setTasks] = useState([]);
     const [currentTask, setCurrentTask] = useState(null);
     const [isEditing, setIsEditing] = useState(false);
     const [error, setError] = useState(null);
     const [stats, setStats] = useState({ total: 0, completed: 0, pending: 0 });
     const [showStats, setShowStats] = useState(false);

  const fetchTasks = async () => {
    try {
      const response = await fetch('http://localhost:8000/tasks');
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      const data = await response.json();
      setTasks(data);
    } catch (error) {
      console.error('Error fetching tasks:', error);
      setError('Failed to fetch tasks. Please try again later.');
    }
  };

  const fetchStats = async () => {
    try {
      const response = await fetch('http://localhost:8000/stats');
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      const data = await response.json();
      setStats(data);
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  };

  useEffect(() => {
    fetchTasks();
    fetchStats();
  }, []);
  
  const addTask = async (taskData) => {
     try{
          const response = await fetch('http://localhost:8000/tasks', {
               method: 'POST',
               headers: { 'Content-Type': 'application/json' },
               body: JSON.stringify(taskData),
          });

          if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
          
               const newTask = await response.json();
               setTasks([...tasks, newTask]);
               fetchStats();
               setError(null);
     } catch(error){
          console.error('Error adding task;', error);
          setError('Failed to add task. Please try again.');
    }
  };

  const updateTask = async (taskId, taskData) => {
     try {
          const response = await fetch(`http://localhost:8000/tasks/${taskId}`, {
               method: 'PUT',
               headers: { 'Content-Type': 'application/json' },
               body: JSON.stringify(taskData),
     });

     if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`)

     const updatedTask = await response.json();
     setTasks(tasks.map(task => task.id === taskId ? updatedTask : task));
      fetchStats();
      setIsEditing(false);
      setCurrentTask(null);
      setError(null);
    } catch (error) {
      console.error('Error updating task:', error);
      setError('Failed to update task. Please try again.');
    }
 };

 const deleteTask = async (taskId) => {
     try{
       const response = await fetch(`http://localhost:8000/tasks/${taskId}`, {
                  method: 'DELETE',
      });
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      
      setTasks(tasks.filter(task => task.id !== taskId));
      fetchStats();
      setError(null);
    } catch (error) {
      console.error('Error deleting task:', error);
      setError('Failed to delete task. Please try again.');
    }
  };

  const toggleComplete = async (taskId, currentStatus) => {
    try {
      const response = await fetch(`http://localhost:8000/tasks/${taskId}/complete`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ is_completed: !currentStatus }),
      });
      
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      
      const updatedTask = await response.json();
      setTasks(tasks.map(task => task.id === taskId ? updatedTask : task));
      fetchStats();
      setError(null);
    } catch (error) {
      console.error('Error toggling task completion:', error);
      setError('Failed to update task status. Please try again.');
    }
  };
  
    const editTask = (task) => {
    setCurrentTask(task);
    setIsEditing(true);
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1>TaskMaster</h1>
        <button 
          className="nav-button"
          onClick={() => setShowStats(!showStats)}
        >
          {showStats ? 'Back to Tasks' : 'View Statistics'}
        </button>
      </header>
      {error && <div className="error-message">{error}</div>}
      {showStats ? (
        <StatisticsPage stats={stats} tasks={tasks} />
      ) : (
        <main>
          <div>
            <TaskForm
              addTask={addTask}
              updateTask={updateTask}
              currentTask={currentTask}
              isEditing={isEditing}
              setIsEditing={setIsEditing}
            />
          </div>
          <TaskList
            tasks={tasks}
            deleteTask={deleteTask}
            editTask={editTask}
            toggleComplete={toggleComplete}
          />
        </main>
      )}
    </div>
  );
}

export default App; 
