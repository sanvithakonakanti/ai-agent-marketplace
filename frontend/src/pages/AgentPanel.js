import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import {
  FaRobot,
  FaCoins,
  FaTasks,
  FaPlus,
  FaSignOutAlt,
  FaLayerGroup,
  FaInbox
} from 'react-icons/fa';

const AgentPanel = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const services = [
    { id: 1, name: 'Smart Summarizer', price: 0.5, status: 'Active' },
    { id: 2, name: 'Prompt Refiner', price: 0.9, status: 'Active' }
  ];

  const taskRequests = [
    { id: 1, task: 'Summarize project proposal', requester: 'Founder Team', reward: 0.5 },
    { id: 2, task: 'Generate API strategy note', requester: 'Dev Squad', reward: 0.9 }
  ];

  const totalEarnings = services.reduce((sum, item) => sum + item.price, 0).toFixed(2);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <div className="min-h-screen app-bg">
      <header className="border-b border-white/10 bg-slate-950/70 backdrop-blur-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <h1 className="text-2xl font-bold text-white">Agent Panel</h1>
          <div className="flex items-center gap-3">
            <span className="text-slate-300 text-sm sm:text-base">{user?.name}</span>
            <button onClick={handleLogout} className="secondary-button px-3 py-2 text-sm">
              <FaSignOutAlt className="mr-2" />
              Logout
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-7">
        <section className="grid md:grid-cols-3 gap-5">
          <article className="glass-card p-5">
            <div className="flex items-center justify-between">
              <p className="text-slate-300">Registered Services</p>
              <FaLayerGroup className="text-cyan-300" />
            </div>
            <p className="text-3xl text-white font-bold mt-2">{services.length}</p>
          </article>

          <article className="glass-card p-5">
            <div className="flex items-center justify-between">
              <p className="text-slate-300">Earnings</p>
              <FaCoins className="text-amber-300" />
            </div>
            <p className="text-3xl text-white font-bold mt-2">{totalEarnings} ALGO</p>
          </article>

          <article className="glass-card p-5">
            <div className="flex items-center justify-between">
              <p className="text-slate-300">Task Requests</p>
              <FaInbox className="text-violet-300" />
            </div>
            <p className="text-3xl text-white font-bold mt-2">{taskRequests.length}</p>
          </article>
        </section>

        <section className="grid lg:grid-cols-2 gap-6">
          <div className="glass-card p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl text-white font-semibold inline-flex items-center gap-2">
                <FaRobot className="text-cyan-300" />
                Registered Services
              </h2>
              <button onClick={() => navigate('/register-agent')} className="neon-button px-4 py-2 text-sm">
                <FaPlus className="mr-2" />
                New Service
              </button>
            </div>

            <div className="space-y-3">
              {services.map((service) => (
                <div key={service.id} className="soft-panel p-4 flex items-center justify-between">
                  <div>
                    <p className="text-white font-medium">{service.name}</p>
                    <p className="text-slate-400 text-sm">{service.price} ALGO per task</p>
                  </div>
                  <span className="rounded-full border border-emerald-300/30 bg-emerald-500/20 px-2.5 py-1 text-xs text-emerald-200">
                    {service.status}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="glass-card p-6">
            <h2 className="text-xl text-white font-semibold mb-4 inline-flex items-center gap-2">
              <FaTasks className="text-violet-300" />
              Incoming Task Requests
            </h2>

            <div className="space-y-3">
              {taskRequests.map((item) => (
                <div key={item.id} className="soft-panel p-4">
                  <p className="text-white font-medium mb-1">{item.task}</p>
                  <div className="text-sm text-slate-400 flex items-center justify-between">
                    <span>Requester: {item.requester}</span>
                    <span className="text-amber-300">{item.reward} ALGO</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};

export default AgentPanel;