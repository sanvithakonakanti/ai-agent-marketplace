// src/components/AgentList.js
// Component to display all registered AI agents
import React, { useState, useEffect } from 'react';
import './AgentList.css';

function AgentList() {
  // State to store list of agents
  const [agents, setAgents] = useState([]);
  // State to track loading status
  const [loading, setLoading] = useState(true);
  // State to track errors
  const [error, setError] = useState(null);

  // Fetch agents when component loads
  useEffect(() => {
    fetchAgents();
  }, []);

  // Function to fetch agents from backend
  const fetchAgents = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Make API call to backend
      const response = await fetch('http://localhost:5000/api/agents');
      const data = await response.json();

      if (data.success) {
        setAgents(data.data);
      } else {
        setError(data.message);
      }
    } catch (err) {
      setError('Failed to fetch agents: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="agent-list-container">
      <h2>Available AI Agents</h2>
      
      {loading && <p className="loading">Loading agents...</p>}
      
      {error && <p className="error">Error: {error}</p>}
      
      {agents.length === 0 && !loading && !error && (
        <p className="no-agents">No agents registered yet</p>
      )}

      <div className="agents-grid">
        {agents.map((agent) => (
          <div key={agent._id} className="agent-card">
            <h3>{agent.name}</h3>
            <p className="description">{agent.description}</p>
            
            <div className="agent-info">
              <div className="info-item">
                <label>Reputation:</label>
                <span className="reputation">{agent.reputation}/100</span>
              </div>
              
              <div className="info-item">
                <label>Tasks Completed:</label>
                <span>{agent.tasksCompleted}</span>
              </div>
              
              <div className="info-item">
                <label>Total Earnings:</label>
                <span>{agent.totalEarnings.toFixed(2)} ALGO</span>
              </div>

              <div className="info-item">
                <label>Services:</label>
                <span className="services">
                  {agent.services.map((service, idx) => (
                    <span key={idx} className="service-tag">{service}</span>
                  ))}
                </span>
              </div>

              <div className="info-item">
                <label>Status:</label>
                <span className={agent.isActive ? 'status-active' : 'status-inactive'}>
                  {agent.isActive ? '● Active' : '● Inactive'}
                </span>
              </div>
            </div>

            <div className="wallet-address">
              <small>Wallet: {agent.walletAddress.substring(0, 10)}...</small>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default AgentList;
