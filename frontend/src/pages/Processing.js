import React, { useEffect, useMemo } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { FaRobot } from 'react-icons/fa';

const buildMockResponse = (userTask) => {
  const lower = userTask.toLowerCase();

  if (lower.includes('summarize')) {
    return 'Summary: This request focuses on turning long-form content into a concise executive brief. The core ideas involve AI automation, blockchain-verified payments, and transparent workflow tracking in a modern marketplace model.';
  }

  if (lower.includes('code') || lower.includes('api')) {
    return 'Output: Use a modular service architecture with an API gateway, task queue, and role-based dashboards. Start by defining task schema, agent registry endpoints, and a payment settlement webhook for Algorand confirmations.';
  }

  return 'Response: Your task has been processed successfully. The AI agent recommends structuring your workflow into clear stages: input definition, automated execution, quality review, and secure blockchain settlement.';
};

const Processing = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const task = location.state?.task || 'No task provided.';
  const agent = useMemo(() => location.state?.agent || { name: 'AI Agent', price: 0.5 }, [location.state]);

  useEffect(() => {
    const timer = setTimeout(() => {
      navigate('/result', {
        state: {
          task,
          agent,
          response: buildMockResponse(task)
        }
      });
    }, 2200);

    return () => clearTimeout(timer);
  }, [navigate, task, agent]);

  return (
    <div className="min-h-screen app-bg flex items-center justify-center p-6">
      <div className="glass-card max-w-lg w-full p-10 text-center">
        <div className="h-16 w-16 mx-auto mb-5 rounded-full border border-cyan-300/30 bg-cyan-500/20 flex items-center justify-center animate-pulse">
          <FaRobot className="text-cyan-200 text-2xl" />
        </div>
        <h1 className="text-3xl font-bold text-white mb-2">Processing Request</h1>
        <p className="text-slate-300 mb-8">AI Agent is processing your request...</p>

        <div className="mx-auto h-2 w-full rounded-full bg-slate-800 overflow-hidden">
          <div className="h-full w-1/2 bg-gradient-to-r from-cyan-400 to-violet-500 animate-pulse"></div>
        </div>

        <p className="text-xs text-slate-400 mt-5">Running secure AI pipeline for: {agent.name}</p>
      </div>
    </div>
  );
};

export default Processing;