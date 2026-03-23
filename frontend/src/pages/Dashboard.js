import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { FaTasks, FaCoins, FaPlus, FaHistory, FaWallet, FaSignOutAlt, FaChartLine } from 'react-icons/fa';

const Dashboard = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('overview');

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  // Mock data
  const userTasks = [
    { id: 1, description: 'Summarize article about AI', status: 'completed', date: '2024-01-15', cost: 0.5 },
    { id: 2, description: 'Generate Python code', status: 'completed', date: '2024-01-14', cost: 0.8 },
    { id: 3, description: 'Write blog post', status: 'pending', date: '2024-01-13', cost: 1.2 }
  ];

  return (
    <div className="min-h-screen app-bg">
      <header className="border-b border-white/10 bg-slate-950/70 backdrop-blur-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <h1 className="text-2xl font-bold text-white">User Dashboard</h1>
            <div className="flex items-center space-x-4">
              <span className="text-slate-300">Welcome, {user?.name}</span>
              <button
                onClick={handleLogout}
                className="inline-flex items-center text-slate-300 hover:text-white px-3 py-2 rounded-lg hover:bg-white/10 transition-colors"
              >
                <FaSignOutAlt className="mr-2" />
                Logout
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid lg:grid-cols-4 gap-8">
          <div className="lg:col-span-1">
            <div className="glass-card p-4">
              <nav className="space-y-2">
                <button
                  onClick={() => setActiveTab('overview')}
                  className={`w-full text-left px-4 py-3 rounded-lg transition-colors ${
                    activeTab === 'overview' ? 'bg-cyan-500/20 text-cyan-200 border border-cyan-300/30' : 'text-slate-300 hover:bg-white/10'
                  }`}
                >
                  Overview
                </button>
                <button
                  onClick={() => setActiveTab('tasks')}
                  className={`w-full text-left px-4 py-3 rounded-lg transition-colors ${
                    activeTab === 'tasks' ? 'bg-cyan-500/20 text-cyan-200 border border-cyan-300/30' : 'text-slate-300 hover:bg-white/10'
                  }`}
                >
                  <FaTasks className="inline mr-2" />
                  Tasks
                </button>
                <button
                  onClick={() => setActiveTab('payments')}
                  className={`w-full text-left px-4 py-3 rounded-lg transition-colors ${
                    activeTab === 'payments' ? 'bg-cyan-500/20 text-cyan-200 border border-cyan-300/30' : 'text-slate-300 hover:bg-white/10'
                  }`}
                >
                  <FaWallet className="inline mr-2" />
                  Payments
                </button>
                <button
                  onClick={() => setActiveTab('agents')}
                  className={`w-full text-left px-4 py-3 rounded-lg transition-colors ${
                    activeTab === 'agents' ? 'bg-cyan-500/20 text-cyan-200 border border-cyan-300/30' : 'text-slate-300 hover:bg-white/10'
                  }`}
                >
                  <FaChartLine className="inline mr-2" />
                  Agents
                </button>
              </nav>
            </div>
          </div>

          <div className="lg:col-span-3">
            {activeTab === 'overview' && (
              <div className="space-y-6">
                <div className="glass-card p-6">
                  <h2 className="text-2xl font-bold text-white mb-2">
                    Welcome back, {user?.name}!
                  </h2>
                  <p className="text-slate-300">
                    Track tasks, monitor payments, and keep execution transparent.
                  </p>
                  <button
                    onClick={() => navigate('/marketplace')}
                    className="mt-4 neon-button"
                  >
                    <FaPlus className="mr-2" />
                    New Task
                  </button>
                </div>

                <div className="grid md:grid-cols-3 gap-6">
                  <div className="glass-card p-6">
                    <div className="flex items-center">
                      <FaTasks className="text-cyan-300 text-2xl mr-4" />
                      <div>
                        <p className="text-2xl font-bold text-white">{userTasks.length}</p>
                        <p className="text-slate-300">Total Tasks</p>
                      </div>
                    </div>
                  </div>
                  <div className="glass-card p-6">
                    <div className="flex items-center">
                      <FaCoins className="text-amber-300 text-2xl mr-4" />
                      <div>
                        <p className="text-2xl font-bold text-white">
                          {userTasks.reduce((sum, task) => sum + task.cost, 0).toFixed(1)}
                        </p>
                        <p className="text-slate-300">ALGO Spent</p>
                      </div>
                    </div>
                  </div>
                  <div className="glass-card p-6">
                    <div className="flex items-center">
                      <FaHistory className="text-emerald-300 text-2xl mr-4" />
                      <div>
                        <p className="text-2xl font-bold text-white">
                          {userTasks.filter(t => t.status === 'completed').length}
                        </p>
                        <p className="text-slate-300">Completed</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'tasks' && (
              <div className="glass-card p-6">
                <h3 className="text-xl font-bold text-white mb-4">Tasks</h3>
                <div className="space-y-4">
                  {userTasks.map(task => (
                    <div key={task.id} className="soft-panel p-4">
                      <div className="flex justify-between items-start">
                        <div>
                          <p className="font-medium text-white">{task.description}</p>
                          <p className="text-sm text-slate-400">{task.date}</p>
                        </div>
                        <div className="text-right">
                          <span className={`px-2 py-1 rounded text-sm ${
                            task.status === 'completed' ? 'bg-emerald-500/20 text-emerald-200' : 'bg-amber-500/20 text-amber-200'
                          }`}>
                            {task.status}
                          </span>
                          <p className="text-sm text-slate-300 mt-1">{task.cost} ALGO</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'payments' && (
              <div className="glass-card p-6">
                <h3 className="text-xl font-bold text-white mb-4">Payments</h3>
                <div className="space-y-4">
                  {userTasks.map(payment => (
                    <div key={payment.id} className="soft-panel p-4">
                      <div className="flex justify-between items-center">
                        <div>
                          <h4 className="font-medium text-white">Task #{payment.id}</h4>
                          <p className="text-sm text-slate-400">Settled on Algorand</p>
                        </div>
                        <div className="text-right">
                          <p className="font-medium text-white">{payment.cost} ALGO</p>
                          <p className="text-sm text-slate-400">{payment.date}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'agents' && (
              <div className="glass-card p-6">
                <h3 className="text-xl font-bold text-white mb-4">Agents</h3>
                <p className="text-slate-300 mb-4">Browse and switch AI services anytime based on quality and speed.</p>
                <button onClick={() => navigate('/marketplace')} className="secondary-button">
                  Open Marketplace
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;