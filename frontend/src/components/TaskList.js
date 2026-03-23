// src/components/TaskList.js
// Component to display all submitted tasks

import React, { useState, useEffect } from 'react';
import './TaskList.css';

function TaskList() {
  // State for tasks
  const [tasks, setTasks] = useState([]);
  // State for loading
  const [loading, setLoading] = useState(true);
  // State for errors
  const [error, setError] = useState(null);
  // State for filtering
  const [filter, setFilter] = useState('all');

  // Fetch tasks when component loads
  useEffect(() => {
    fetchTasks();
    // Refresh tasks every 5 seconds
    const interval = setInterval(fetchTasks, 5000);
    return () => clearInterval(interval);
  }, []);

  // Function to fetch tasks from backend
  const fetchTasks = async () => {
    try {
      setError(null);
      
      // Build URL with filter
      let url = 'http://localhost:5000/api/tasks';
      if (filter !== 'all') {
        url += `?status=${filter}`;
      }

      // Make API call
      const response = await fetch(url);
      const data = await response.json();

      if (data.success) {
        setTasks(data.data);
      } else {
        setError(data.message);
      }
    } catch (err) {
      setError('Failed to fetch tasks: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  // Update filter and fetch
  const handleFilterChange = (newFilter) => {
    setFilter(newFilter);
  };

  // Get status badge color
  const getStatusColor = (status) => {
    switch(status) {
      case 'open': return 'badge-open';
      case 'assigned': return 'badge-assigned';
      case 'completed': return 'badge-completed';
      case 'cancelled': return 'badge-cancelled';
      default: return 'badge-open';
    }
  };

  // Format date
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString() + ' ' + date.toLocaleTimeString();
  };

  return (
    <div className="task-list-container">
      <h2>All Tasks</h2>

      <div className="filter-buttons">
        <button 
          className={`filter-btn ${filter === 'all' ? 'active' : ''}`}
          onClick={() => handleFilterChange('all')}
        >
          All Tasks
        </button>
        <button 
          className={`filter-btn ${filter === 'open' ? 'active' : ''}`}
          onClick={() => handleFilterChange('open')}
        >
          Open
        </button>
        <button 
          className={`filter-btn ${filter === 'assigned' ? 'active' : ''}`}
          onClick={() => handleFilterChange('assigned')}
        >
          Assigned
        </button>
        <button 
          className={`filter-btn ${filter === 'completed' ? 'active' : ''}`}
          onClick={() => handleFilterChange('completed')}
        >
          Completed
        </button>
      </div>

      {loading && <p className="loading">Loading tasks...</p>}
      
      {error && <p className="error">Error: {error}</p>}
      
      {tasks.length === 0 && !loading && !error && (
        <p className="no-tasks">No tasks found</p>
      )}

      <div className="tasks-list">
        {tasks.map((task) => (
          <div key={task._id} className="task-card">
            <div className="task-header">
              <h3>{task.title}</h3>
              <span className={`status-badge ${getStatusColor(task.status)}`}>
                {task.status.toUpperCase()}
              </span>
            </div>

            <p className="task-description">{task.description}</p>

            <div className="task-details">
              <div className="detail-item">
                <label>Service Type:</label>
                <span>{task.serviceType}</span>
              </div>

              <div className="detail-item">
                <label>Budget:</label>
                <span className="budget">{task.budget.toFixed(2)} ALGO</span>
              </div>

              <div className="detail-item">
                <label>Assigned Agent:</label>
                <span>
                  {task.assignedAgent ? task.assignedAgent.name : 'Not assigned'}
                </span>
              </div>

              <div className="detail-item">
                <label>User Address:</label>
                <span className="address">{task.userAddress.substring(0, 15)}...</span>
              </div>

              <div className="detail-item">
                <label>Created:</label>
                <span>{formatDate(task.createdAt)}</span>
              </div>

              {task.status === 'completed' && (
                <>
                  <div className="detail-item">
                    <label>Result:</label>
                    <span className="result">{task.result}</span>
                  </div>
                  <div className="detail-item">
                    <label>Completed:</label>
                    <span>{formatDate(task.completedAt)}</span>
                  </div>
                  <div className="detail-item">
                    <label>Transaction ID:</label>
                    <span className="txn-id">{task.transactionId.substring(0, 20)}...</span>
                  </div>
                </>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default TaskList;
