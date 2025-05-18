import React from 'react';
import { Pie, Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
  Title
} from 'chart.js';

// Register ChartJS components
ChartJS.register(
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
  Title
);

function StatisticsPage({ stats, tasks }) {
  // Prepare data for pie chart
  const pieData = {
    labels: ['Completed', 'Pending'],
    datasets: [
      {
        data: [stats.completed, stats.pending],
        backgroundColor: ['#4CAF50', '#FFA500'],
        borderColor: ['#45a049', '#FF8C00'],
        borderWidth: 1,
      },
    ],
  };

  // Prepare data for priority distribution bar chart
  const priorityCounts = tasks.reduce((acc, task) => {
    acc[task.priority] = (acc[task.priority] || 0) + 1;
    return acc;
  }, {});

  const barData = {
    labels: ['Low', 'Medium', 'High'],
    datasets: [
      {
        label: 'Tasks by Priority',
        data: [
          priorityCounts[1] || 0,
          priorityCounts[2] || 0,
          priorityCounts[3] || 0,
        ],
        backgroundColor: ['#4CAF50', '#FFA500', '#f44336'],
        borderColor: ['#45a049', '#FF8C00', '#d32f2f'],
        borderWidth: 1,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: { position: 'top' },
      title: { display: true },
    },
  };

  const barOptions = {
    ...chartOptions,
    plugins: {
      ...chartOptions.plugins,
      title: { ...chartOptions.plugins.title, text: 'Task Distribution by Priority' },
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: { stepSize: 1 },
      },
    },
  };

  const pieOptions = {
    ...chartOptions,
    plugins: {
      ...chartOptions.plugins,
      title: { ...chartOptions.plugins.title, text: 'Task Completion Status' },
    },
  };

  const completionRate = stats.total > 0 ? (stats.completed / stats.total) * 100 : 0;

  return (
    <div className="statistics-page">
      <h1>Task Statistics Dashboard</h1>
      
      <div className="stats-overview">
        <div className="stat-card total">
          <h3>Total Tasks</h3>
          <p className="stat-number">{stats.total}</p>
        </div>
        <div className="stat-card completed">
          <h3>Completed</h3>
          <p className="stat-number">{stats.completed}</p>
        </div>
        <div className="stat-card pending">
          <h3>Pending</h3>
          <p className="stat-number">{stats.pending}</p>
        </div>
      </div>

      <div className="charts-container">
        <div className="chart-card">
          <Pie data={pieData} options={pieOptions} />
        </div>
        <div className="chart-card">
          <Bar data={barData} options={barOptions} />
        </div>
      </div>

      <div className="completion-rate">
        <h2>Completion Rate</h2>
        <div className="progress-bar">
          <div 
            className="progress-fill"
            style={{ 
              width: `${completionRate}%`,
              backgroundColor: '#4CAF50'
            }}
          />
        </div>
        <p className="rate-text">
          {stats.total > 0 
            ? `${Math.round(completionRate)}% Complete`
            : 'No tasks yet'}
        </p>
      </div>
    </div>
  );
}

export default StatisticsPage; 