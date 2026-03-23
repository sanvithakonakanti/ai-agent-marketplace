import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaRobot, FaCoins, FaArrowRight, FaBolt, FaRocket, FaStar } from 'react-icons/fa';

const Marketplace = () => {
  const [agents, setAgents] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    // Mock data - in real app, fetch from API
    const mockAgents = [
      {
        id: 1,
        name: 'Text Summarizer Pro',
        description: 'Advanced AI for summarizing long texts into concise, readable formats.',
        category: 'Text Analysis',
        price: 0.5,
        rating: 4.8,
        tag: 'Popular'
      },
      {
        id: 2,
        name: 'Code Generator',
        description: 'Generate high-quality code snippets in multiple programming languages.',
        category: 'Code Generation',
        price: 1.2,
        rating: 4.9,
        tag: 'Fast'
      },
      {
        id: 3,
        name: 'Content Writer',
        description: 'Create engaging blog posts, articles, and marketing content.',
        category: 'Content Creation',
        price: 0.8,
        rating: 4.7,
        tag: 'New'
      },
      {
        id: 4,
        name: 'Data Analyzer',
        description: 'Process and analyze datasets to extract meaningful insights.',
        category: 'Data Processing',
        price: 1.5,
        rating: 4.6,
        tag: 'Popular'
      }
    ];
    setAgents(mockAgents);
    setLoading(false);
  }, []);

  const handleUseService = (agent) => {
    navigate('/tasks', { state: { agent } });
  };

  const getTagStyle = (tag) => {
    if (tag === 'Popular') return 'bg-cyan-500/20 text-cyan-200 border-cyan-300/30';
    if (tag === 'Fast') return 'bg-violet-500/20 text-violet-200 border-violet-300/30';
    return 'bg-emerald-500/20 text-emerald-200 border-emerald-300/30';
  };

  const getTagIcon = (tag) => {
    if (tag === 'Popular') return <FaStar className="mr-1" />;
    if (tag === 'Fast') return <FaBolt className="mr-1" />;
    return <FaRocket className="mr-1" />;
  };

  if (loading) {
    return (
      <div className="min-h-screen app-bg flex items-center justify-center">
        <div className="text-center">
          <div className="h-12 w-12 rounded-full border-2 border-cyan-300/30 border-t-cyan-300 mx-auto mb-4 animate-spin"></div>
          <p className="text-slate-300">Loading AI agents...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen app-bg p-4 sm:p-8">
      <div className="mx-auto max-w-7xl">
        <div className="mb-10 text-center">
          <h1 className="text-4xl sm:text-5xl font-bold text-white mb-3">Marketplace</h1>
          <p className="text-slate-300 text-base sm:text-lg">Discover premium AI services with on-chain settlement</p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {agents.map(agent => (
            <article
              key={agent.id}
              className="glass-card p-6 transition-all duration-300 hover:-translate-y-1 hover:border-cyan-300/40"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center">
                  <div className="h-12 w-12 rounded-lg bg-violet-500/20 border border-violet-300/30 flex items-center justify-center mr-4">
                    <FaRobot className="text-violet-200 text-xl" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-white">{agent.name}</h3>
                    <span className="text-sm text-slate-400">{agent.category}</span>
                  </div>
                </div>
                <span className={`inline-flex items-center rounded-full border px-2.5 py-1 text-xs ${getTagStyle(agent.tag)}`}>
                  {getTagIcon(agent.tag)}
                  {agent.tag}
                </span>
              </div>

              <p className="text-slate-300 mb-5 leading-6">{agent.description}</p>

              <div className="flex items-center justify-between mb-5">
                <div className="flex items-center text-cyan-200 font-semibold">
                  <FaCoins className="mr-1" />
                  {agent.price} ALGO
                </div>
                <div className="text-sm text-amber-300">
                  {agent.rating} / 5.0
                </div>
              </div>

              <button
                onClick={() => handleUseService(agent)}
                className="neon-button w-full"
              >
                Use Service
                <FaArrowRight className="ml-2" />
              </button>
            </article>
          ))}
        </div>

        {agents.length === 0 && (
          <div className="text-center py-16 soft-panel">
            <FaRobot className="text-slate-500 text-6xl mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-white mb-2">No agents available</h3>
            <p className="text-slate-400">Check back later for new AI agents</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Marketplace;