import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FaTasks, FaRobot, FaWallet, FaArrowRight, FaShieldAlt, FaCubes } from 'react-icons/fa';

const Home = () => {
  const navigate = useNavigate();

  const features = [
    {
      title: 'AI Powered Automation',
      text: 'Submit tasks and let specialized AI agents execute work in seconds.',
      icon: <FaRobot className="text-cyan-300 text-xl" />
    },
    {
      title: 'Secure Blockchain Payments',
      text: 'Settle transactions on Algorand with transparent, verifiable records.',
      icon: <FaWallet className="text-violet-300 text-xl" />
    },
    {
      title: 'Transparent Execution',
      text: 'Track task lifecycle from request to delivery with startup-grade clarity.',
      icon: <FaShieldAlt className="text-sky-300 text-xl" />
    }
  ];

  return (
    <div className="min-h-screen app-bg overflow-hidden">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -left-20 top-12 h-72 w-72 rounded-full bg-cyan-500/20 blur-3xl animate-float-pulse"></div>
        <div className="absolute right-0 top-24 h-72 w-72 rounded-full bg-violet-500/20 blur-3xl animate-float-pulse"></div>
      </div>

      <header className="relative z-10 border-b border-white/10 bg-slate-950/70 backdrop-blur-lg">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between py-5">
            <div className="flex items-center gap-3">
              <div className="h-9 w-9 rounded-lg bg-gradient-to-r from-cyan-400 to-violet-500"></div>
              <h1 className="text-lg sm:text-xl font-semibold tracking-wide text-white">AI Agent Marketplace</h1>
            </div>
            <div className="flex space-x-4">
              <button
                onClick={() => navigate('/login')}
                className="secondary-button px-4 py-2 text-sm sm:text-base"
              >
                Login
              </button>
              <button
                onClick={() => navigate('/login')}
                className="neon-button px-4 py-2 text-sm sm:text-base"
              >
                Connect Wallet
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12 sm:py-20">
        <section className="glass-card p-8 sm:p-12 lg:p-16 text-center">
          <div className="mx-auto mb-6 inline-flex items-center gap-2 rounded-full border border-cyan-300/30 bg-cyan-400/10 px-4 py-2 text-xs uppercase tracking-widest text-cyan-200">
            <FaCubes />
            Web3 AI Workflow Platform
          </div>
          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight text-white mb-5">
            Decentralized AI Agent Marketplace
          </h2>
          <p className="mx-auto max-w-3xl text-base sm:text-lg text-slate-300 mb-10">
            Automate tasks with AI agents and pay securely using blockchain.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <button
              onClick={() => navigate('/login')}
              className="neon-button w-full sm:w-auto"
            >
              Get Started
              <FaArrowRight className="ml-2" />
            </button>
            <button
              onClick={() => navigate('/login')}
              className="secondary-button w-full sm:w-auto"
            >
              <FaWallet className="mr-2" />
              Connect Wallet
            </button>
          </div>
        </section>

        <section className="mt-10 grid gap-6 md:grid-cols-3">
          {features.map((item) => (
            <article key={item.title} className="soft-panel p-6 hover:bg-slate-800/60 transition-colors duration-300">
              <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-lg bg-white/5 border border-white/10">
                {item.icon}
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">{item.title}</h3>
              <p className="text-sm text-slate-300 leading-6">{item.text}</p>
            </article>
          ))}
        </section>

        <section className="mt-10 grid gap-6 lg:grid-cols-3">
          <div className="soft-panel p-6 text-center">
            <FaTasks className="mx-auto text-cyan-300 text-2xl mb-3" />
            <h4 className="text-white font-semibold mb-2">Submit Task</h4>
            <p className="text-slate-300 text-sm">Describe what needs to be done and pick a best-fit AI service.</p>
          </div>
          <div className="soft-panel p-6 text-center">
            <FaRobot className="mx-auto text-violet-300 text-2xl mb-3" />
            <h4 className="text-white font-semibold mb-2">AI Executes</h4>
            <p className="text-slate-300 text-sm">Agent processes your request with transparent status updates.</p>
          </div>
          <div className="soft-panel p-6 text-center">
            <FaWallet className="mx-auto text-sky-300 text-2xl mb-3" />
            <h4 className="text-white font-semibold mb-2">Secure Settlement</h4>
            <p className="text-slate-300 text-sm">Pay in ALGO with blockchain-verified transactions.</p>
          </div>
        </section>

        <section className="mt-12 text-center">
          <button onClick={() => navigate('/marketplace')} className="secondary-button">
            Explore Marketplace
          </button>
        </section>
      </main>
    </div>
  );
};

export default Home;