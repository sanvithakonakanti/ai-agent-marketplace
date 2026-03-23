// frontend/src/components/PaymentModal.js
// Payment processing modal for settling tasks on blockchain

import React, { useState } from 'react';
import './PaymentModal.css';

function PaymentModal({ task, agent, onClose, onSuccess }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    agentPrivateKey: '',
    confirmPayment: false
  });
  const [result, setResult] = useState(null);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (!formData.agentPrivateKey) {
        throw new Error('Agent private key is required');
      }

      if (!formData.confirmPayment) {
        throw new Error('Please confirm the payment');
      }

      // Send payment via blockchain
      const response = await fetch('http://localhost:5000/api/algorand/settlement/process', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          taskId: task._id,
          agentPrivateKey: formData.agentPrivateKey
        })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Payment failed');
      }

      setResult(data.settlement);
      onSuccess(data.settlement);

    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (result) {
    return (
      <div className="modal-overlay" onClick={onClose}>
        <div className="modal-content" onClick={e => e.stopPropagation()}>
          <div className="modal-header">
            <h2>✓ Payment Confirmed</h2>
            <button className="close-btn" onClick={onClose}>×</button>
          </div>
          <div className="payment-result">
            <div className="result-item">
              <span>Transaction ID:</span>
              <code>{result.transactionId}</code>
            </div>
            <div className="result-item">
              <span>Amount:</span>
              <strong>{result.amount} Algos</strong>
            </div>
            <div className="result-item">
              <span>From:</span>
              <code>{result.from}</code>
            </div>
            <div className="result-item">
              <span>To:</span>
              <code>{result.to}</code>
            </div>
            <div className="result-item">
              <span>Confirmed Round:</span>
              <code>{result.confirmedRound}</code>
            </div>
            <div className="result-item">
              <span>View on Explorer:</span>
              <a 
                href={`https://testnet.algoexplorer.io/tx/${result.transactionId}`}
                target="_blank"
                rel="noopener noreferrer"
              >
                AlgoExplorer →
              </a>
            </div>
          </div>
          <button className="btn btn-primary" onClick={onClose}>
            Close
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <h2>Process Payment</h2>
          <button className="close-btn" onClick={onClose}>×</button>
        </div>

        {error && <div className="error-message">{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Task</label>
            <input 
              type="text" 
              value={task.title}
              disabled
            />
          </div>

          <div className="form-group">
            <label>Agent</label>
            <input 
              type="text" 
              value={agent?.name || 'Unknown'}
              disabled
            />
          </div>

          <div className="form-group">
            <label>Payment Amount (Algos)</label>
            <input 
              type="number" 
              value={task.budget}
              disabled
            />
          </div>

          <div className="form-group">
            <label>Agent Private Key (Base64)</label>
            <textarea
              name="agentPrivateKey"
              value={formData.agentPrivateKey}
              onChange={handleChange}
              placeholder="Paste the agent's base64-encoded private key here"
              rows="4"
              required
            />
            <small>⚠️ Warning: Never share your private key. This is for development only.</small>
          </div>

          <div className="form-group checkbox">
            <input
              type="checkbox"
              name="confirmPayment"
              checked={formData.confirmPayment}
              onChange={handleChange}
              required
            />
            <label>I confirm this {task.budget} Algo payment</label>
          </div>

          <div className="form-actions">
            <button 
              type="button" 
              className="btn btn-secondary"
              onClick={onClose}
              disabled={loading}
            >
              Cancel
            </button>
            <button 
              type="submit" 
              className="btn btn-primary"
              disabled={loading}
            >
              {loading ? 'Processing...' : 'Send Payment'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default PaymentModal;
