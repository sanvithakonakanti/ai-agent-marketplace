import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { FaRobot, FaUser, FaCoins, FaArrowLeft, FaArrowRight } from 'react-icons/fa';

const AIResponse = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { task, response, agent } = location.state || {
    task: '',
    response: 'No AI response available yet.',
    agent: { name: 'AI Agent', price: 0.5 }
  };

  const handlePayment = () => {
    navigate('/payment', { state: { amount: agent?.price || 0.5, task, response, agent } });
  };

  return (
    <div className="min-h-screen app-bg p-4 sm:p-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center mb-8">
          <button
            onClick={() => navigate('/tasks')}
            className="inline-flex items-center text-slate-300 hover:text-white mr-4"
          >
            <FaArrowLeft className="mr-2" />
            Back to Tasks
          </button>
        </div>

        <div className="glass-card overflow-hidden">
          <div className="border-b border-white/10 p-5 sm:p-6 bg-slate-900/70">
            <p className="text-xs uppercase tracking-widest text-slate-400 mb-1">Result from</p>
            <h2 className="text-xl font-semibold text-white">{agent?.name || 'AI Agent'}</h2>
          </div>

          <div className="p-6 border-b border-white/10">
            <div className="flex items-start space-x-4">
              <div className="bg-cyan-500/20 border border-cyan-300/30 w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0">
                <FaUser className="text-cyan-200" />
              </div>
              <div className="flex-1">
                <div className="flex items-center mb-2">
                  <span className="font-medium text-white">Your Task</span>
                  <span className="text-sm text-slate-400 ml-2">Input</span>
                </div>
                <div className="soft-panel p-4">
                  <p className="text-slate-200 whitespace-pre-wrap">{task}</p>
                </div>
              </div>
            </div>
          </div>

          <div className="p-6">
            <div className="flex items-start space-x-4">
              <div className="bg-violet-500/20 border border-violet-300/30 w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0">
                <FaRobot className="text-violet-200" />
              </div>
              <div className="flex-1">
                <div className="flex items-center mb-2">
                  <span className="font-medium text-white">AI Output</span>
                  <span className="text-sm text-slate-400 ml-2">Generated</span>
                </div>
                <div className="rounded-xl p-5 border border-cyan-300/25 bg-gradient-to-r from-cyan-500/10 to-violet-500/10">
                  <pre className="whitespace-pre-wrap text-slate-100 font-sans text-sm sm:text-base">{response}</pre>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-slate-950/70 p-6 border-t border-white/10">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div className="flex items-center space-x-4">
                <div className="bg-amber-500/20 border border-amber-300/30 w-12 h-12 rounded-full flex items-center justify-center">
                  <FaCoins className="text-amber-300 text-xl" />
                </div>
                <div>
                  <p className="font-medium text-slate-300">Service Fee</p>
                  <p className="text-2xl font-bold text-white">{agent?.price || 0.5} ALGO</p>
                </div>
              </div>
              <button
                onClick={handlePayment}
                className="neon-button"
              >
                Proceed to Payment
                <FaArrowRight className="ml-2" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AIResponse;