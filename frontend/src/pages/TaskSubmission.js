import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { FaTasks, FaArrowRight, FaArrowLeft, FaRobot, FaCoins } from 'react-icons/fa';

const TaskSubmission = () => {
  const [task, setTask] = useState('');
  const location = useLocation();
  const navigate = useNavigate();
  const selectedAgent = location.state?.agent || {
    name: 'Text Summarizer Pro',
    category: 'Text Analysis',
    price: 0.5
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!task.trim()) return;

    navigate('/processing', {
      state: {
        task,
        agent: selectedAgent
      }
    });
  };

  return (
    <div className="min-h-screen app-bg p-4 sm:p-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center mb-8">
          <button
            onClick={() => navigate('/marketplace')}
            className="inline-flex items-center text-slate-300 hover:text-white mr-4"
          >
            <FaArrowLeft className="mr-2" />
            Back to Marketplace
          </button>
        </div>

        <div className="glass-card p-6 sm:p-8">
          <div className="soft-panel p-4 sm:p-5 mb-7">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
              <div className="flex items-center">
                <div className="h-11 w-11 rounded-lg bg-violet-500/20 border border-violet-300/30 flex items-center justify-center mr-3">
                  <FaRobot className="text-violet-200" />
                </div>
                <div>
                  <p className="text-xs uppercase tracking-wider text-slate-400">Selected Agent</p>
                  <p className="text-white font-semibold">{selectedAgent.name}</p>
                </div>
              </div>
              <div className="inline-flex items-center text-cyan-200 font-semibold">
                <FaCoins className="mr-1" />
                {selectedAgent.price} ALGO
              </div>
            </div>
          </div>

          <div className="text-center mb-8">
            <div className="bg-cyan-500/20 border border-cyan-300/30 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4">
              <FaTasks className="text-cyan-200 text-3xl" />
            </div>
            <h1 className="text-3xl font-bold text-white mb-2">Submit Task</h1>
            <p className="text-slate-300">Describe what you need. The AI agent will process it instantly.</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-slate-200 mb-2">Task Description</label>
              <textarea
                value={task}
                onChange={(e) => setTask(e.target.value)}
                required
                rows={8}
                className="input-dark min-h-[220px] text-base sm:text-lg"
                placeholder="Enter your task (e.g., summarize this text, draft a landing page copy, generate API code...)"
              />
            </div>

            <div className="soft-panel p-4">
              <h3 className="font-medium text-white mb-2">Try prompts like:</h3>
              <ul className="text-sm text-slate-300 space-y-1">
                <li>- Summarize this market report into 5 key points.</li>
                <li>- Create a concise investor update from this text.</li>
                <li>- Generate a clean API spec from this feature request.</li>
              </ul>
            </div>

            <button
              type="submit"
              disabled={!task.trim()}
              className="neon-button w-full disabled:opacity-40 disabled:cursor-not-allowed"
            >
              Generate AI Response
              <FaArrowRight className="ml-2" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default TaskSubmission;