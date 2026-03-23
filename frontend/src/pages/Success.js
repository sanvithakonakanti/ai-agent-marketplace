import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { FaCheckCircle, FaArrowRight, FaHashtag, FaClock } from 'react-icons/fa';

const Success = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const txId = location.state?.txId || 'ALGO-DEMO-TX';
  const timestamp = location.state?.timestamp || new Date().toISOString();
  const amount = location.state?.amount || 0.5;

  return (
    <div className="min-h-screen app-bg flex items-center justify-center p-6">
      <div className="glass-card max-w-xl w-full p-8 sm:p-10 text-center">
        <div className="mx-auto mb-5 h-20 w-20 rounded-full bg-emerald-500/20 border border-emerald-300/30 flex items-center justify-center animate-pulse">
          <FaCheckCircle className="text-emerald-300 text-4xl" />
        </div>

        <h1 className="text-3xl sm:text-4xl font-bold text-white mb-2">Transaction Successful</h1>
        <p className="text-slate-300 mb-7">Your blockchain payment has been confirmed.</p>

        <div className="soft-panel text-left p-5 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-slate-400 inline-flex items-center gap-2"><FaHashtag /> Transaction ID</span>
            <span className="text-slate-100 font-mono text-sm">{txId}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-slate-400 inline-flex items-center gap-2"><FaClock /> Timestamp</span>
            <span className="text-slate-200 text-sm">{new Date(timestamp).toLocaleString()}</span>
          </div>
          <div className="flex items-center justify-between border-t border-white/10 pt-3">
            <span className="text-slate-300">Amount</span>
            <span className="text-white font-semibold">{amount} ALGO</span>
          </div>
        </div>

        <button onClick={() => navigate('/dashboard')} className="neon-button mt-7 w-full">
          View Dashboard
          <FaArrowRight className="ml-2" />
        </button>
      </div>
    </div>
  );
};

export default Success;