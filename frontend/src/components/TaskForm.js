// src/components/TaskForm.js
// Component for users to submit new tasks

import React, { useState } from 'react';
import './TaskForm.css';

function TaskForm({ onTaskSubmitted }) {
  // Form state
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    serviceType: 'summarization',
    userAddress: '',
    budget: ''
  });

  // State for loading and messages
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);
  const [messageType, setMessageType] = useState(''); // 'success' or 'error'

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    try {
      // Validate all fields
      if (!formData.title || !formData.description || !formData.userAddress || !formData.budget) {
        throw new Error('All fields are required');
      }

      // Validate wallet address format (simplified - just check length)
      if (formData.userAddress.length < 20) {
        throw new Error('Invalid Algorand wallet address');
      }

      // Validate budget
      if (parseFloat(formData.budget) <= 0) {
        throw new Error('Budget must be greater than 0');
      }

      // Make API call to submit task
      const response = await fetch('http://localhost:5000/api/tasks/submit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          ...formData,
          budget: parseFloat(formData.budget)
        })
      });

      const data = await response.json();

      if (data.success) {
        setMessageType('success');
        setMessage('✓ Task submitted successfully!');
        
        // Reset form
        setFormData({
          title: '',
          description: '',
          serviceType: 'summarization',
          userAddress: '',
          budget: ''
        });

        // Notify parent component
        if (onTaskSubmitted) {
          onTaskSubmitted(data.data);
        }
      } else {
        throw new Error(data.message);
      }
    } catch (err) {
      setMessageType('error');
      setMessage('✗ Error: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="task-form-container">
      <h2>Submit a New Task</h2>
      
      <form onSubmit={handleSubmit} className="task-form">
        <div className="form-group">
          <label htmlFor="title">Task Title *</label>
          <input
            type="text"
            id="title"
            name="title"
            placeholder="e.g., Summarize my article"
            value={formData.title}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="description">Task Description *</label>
          <textarea
            id="description"
            name="description"
            placeholder="Describe what you need the AI agent to do..."
            rows="4"
            value={formData.description}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-row">
          <div className="form-group">
            <label htmlFor="serviceType">Service Type *</label>
            <select
              id="serviceType"
              name="serviceType"
              value={formData.serviceType}
              onChange={handleChange}
              required
            >
              <option value="summarization">Summarization</option>
              <option value="sentiment-analysis">Sentiment Analysis</option>
              <option value="translation">Translation</option>
              <option value="content-generation">Content Generation</option>
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="budget">Budget (ALGO) *</label>
            <input
              type="number"
              id="budget"
              name="budget"
              placeholder="e.g., 5.0"
              step="0.1"
              min="0"
              value={formData.budget}
              onChange={handleChange}
              required
            />
          </div>
        </div>

        <div className="form-group">
          <label htmlFor="userAddress">Your Wallet Address *</label>
          <input
            type="text"
            id="userAddress"
            name="userAddress"
            placeholder="Your Algorand wallet address (starts with A)"
            value={formData.userAddress}
            onChange={handleChange}
            required
          />
          <small className="help-text">Get your address from AlgoExplorer or MyAlgo wallet</small>
        </div>

        {message && (
          <div className={`message ${messageType}`}>
            {message}
          </div>
        )}

        <button 
          type="submit" 
          className="submit-btn"
          disabled={loading}
        >
          {loading ? 'Submitting...' : 'Submit Task'}
        </button>
      </form>
    </div>
  );
}

export default TaskForm;
