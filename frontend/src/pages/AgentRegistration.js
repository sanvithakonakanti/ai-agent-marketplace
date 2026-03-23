import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaRobot, FaArrowLeft, FaWallet } from 'react-icons/fa';

const AgentRegistration = () => {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    category: '',
    price: '',
    walletAddress: ''
  });
  const navigate = useNavigate();

  const categories = [
    'Text Analysis',
    'Content Creation',
    'Data Processing',
    'Code Generation',
    'Translation',
    'Research',
    'Other'
  ];

  const handleSubmit = (e) => {
    e.preventDefault();
    // Mock registration - in real app, call API
    console.log('Agent registered:', formData);
    alert('Agent registered successfully!');
    navigate('/dashboard');
  };

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <div className="min-h-screen app-bg p-4 sm:p-8">
      <div className="max-w-2xl mx-auto">
        <div className="flex items-center mb-8">
          <button
            onClick={() => navigate('/agent-panel')}
            className="inline-flex items-center text-slate-300 hover:text-white mr-4"
          >
            <FaArrowLeft className="mr-2" />
            Back to Agent Panel
          </button>
        </div>

        <div className="glass-card p-7 sm:p-8">
          <div className="text-center mb-8">
            <div className="bg-violet-500/20 border border-violet-300/30 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4">
              <FaRobot className="text-violet-200 text-3xl" />
            </div>
            <h1 className="text-3xl font-bold text-white mb-2">Register New Service</h1>
            <p className="text-slate-300">Publish your AI capability and start receiving paid tasks</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-slate-200 mb-2">Agent Name</label>
              <input
                type="text"
                name="name"
                required
                value={formData.name}
                onChange={handleInputChange}
                className="input-dark"
                placeholder="e.g., Text Summarizer Pro"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-200 mb-2">Description</label>
              <textarea
                name="description"
                required
                value={formData.description}
                onChange={handleInputChange}
                rows={4}
                className="input-dark"
                placeholder="Describe what your AI agent does..."
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-200 mb-2">Category</label>
              <select
                name="category"
                required
                value={formData.category}
                onChange={handleInputChange}
                className="input-dark"
              >
                <option value="">Select a category</option>
                {categories.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-200 mb-2">Price (ALGO)</label>
              <input
                type="number"
                name="price"
                required
                step="0.01"
                min="0"
                value={formData.price}
                onChange={handleInputChange}
                className="input-dark"
                placeholder="0.50"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-200 mb-2">Wallet Address</label>
              <input
                type="text"
                name="walletAddress"
                required
                value={formData.walletAddress}
                onChange={handleInputChange}
                className="input-dark"
                placeholder="Your Algorand wallet address"
              />
              <p className="mt-2 text-xs text-slate-400 inline-flex items-center gap-2">
                <FaWallet />
                Payments settle directly to this address
              </p>
            </div>

            <button
              type="submit"
              className="neon-button w-full"
            >
              Register Agent
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AgentRegistration;