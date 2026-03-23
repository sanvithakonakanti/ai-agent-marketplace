import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { FaUser, FaRobot, FaWallet, FaArrowLeft } from 'react-icons/fa';

const LoginSignup = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [role, setRole] = useState('user');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: ''
  });
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    // Mock authentication - in real app, call API
    const userData = {
      id: Date.now(),
      name: formData.name || formData.email,
      email: formData.email,
      role: role
    };
    login(userData);

    // Redirect based on role
    if (role === 'agent') {
      navigate('/agent-panel');
    } else {
      navigate('/tasks');
    }
  };

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <div className="min-h-screen app-bg flex items-center justify-center p-4 sm:p-8">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute top-16 left-1/3 h-56 w-56 rounded-full bg-cyan-500/20 blur-3xl"></div>
        <div className="absolute bottom-12 right-1/4 h-56 w-56 rounded-full bg-violet-500/20 blur-3xl"></div>
      </div>

      <div className="relative w-full max-w-md glass-card p-7 sm:p-9">
        <button onClick={() => navigate('/')} className="mb-5 inline-flex items-center text-sm text-slate-300 hover:text-white transition-colors">
          <FaArrowLeft className="mr-2" />
          Back to Home
        </button>

        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">Welcome Back</h1>
          <p className="text-slate-300">Login or signup to access the AI marketplace</p>
        </div>

        <div className="flex mb-6 bg-slate-800/80 rounded-xl p-1 border border-white/10">
          <button
            onClick={() => setRole('user')}
            className={`flex-1 flex items-center justify-center py-2.5 px-3 rounded-lg transition-all ${
              role === 'user' ? 'bg-cyan-500/20 text-cyan-200 border border-cyan-300/30' : 'text-slate-400'
            }`}
          >
            <FaUser className="mr-2" />
            Login as User
          </button>
          <button
            onClick={() => setRole('agent')}
            className={`flex-1 flex items-center justify-center py-2.5 px-3 rounded-lg transition-all ${
              role === 'agent' ? 'bg-violet-500/20 text-violet-200 border border-violet-300/30' : 'text-slate-400'
            }`}
          >
            <FaRobot className="mr-2" />
            Login as Agent
          </button>
        </div>

        <div className="flex mb-6 bg-slate-800/80 rounded-xl p-1 border border-white/10">
          <button
            onClick={() => setIsLogin(true)}
            className={`flex-1 py-2.5 px-4 rounded-lg transition-all ${
              isLogin ? 'bg-white/15 text-white' : 'text-slate-400'
            }`}
          >
            Login
          </button>
          <button
            onClick={() => setIsLogin(false)}
            className={`flex-1 py-2.5 px-4 rounded-lg transition-all ${
              !isLogin ? 'bg-white/15 text-white' : 'text-slate-400'
            }`}
          >
            Sign Up
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {!isLogin && (
            <div>
              <label className="block text-sm font-medium text-slate-200 mb-1.5">Name</label>
              <input
                type="text"
                name="name"
                required={!isLogin}
                value={formData.name}
                onChange={handleInputChange}
                className="input-dark"
                placeholder="Your name"
              />
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-slate-200 mb-1.5">Email</label>
            <input
              type="email"
              name="email"
              required
              value={formData.email}
              onChange={handleInputChange}
              className="input-dark"
              placeholder="your@email.com"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-200 mb-1.5">Password</label>
            <input
              type="password"
              name="password"
              required
              value={formData.password}
              onChange={handleInputChange}
              className="input-dark"
              placeholder="••••••••"
            />
          </div>

          {!isLogin && (
            <div>
              <label className="block text-sm font-medium text-slate-200 mb-1.5">Role</label>
              <select value={role} onChange={(e) => setRole(e.target.value)} className="input-dark">
                <option value="user">User</option>
                <option value="agent">AI Agent</option>
              </select>
            </div>
          )}

          <button
            type="submit"
            className="neon-button w-full"
          >
            {isLogin ? 'Login' : 'Create Account'}
          </button>
        </form>

        <div className="mt-6 text-center">
          <button className="secondary-button w-full">
            <FaWallet className="mr-2" />
            Continue with Wallet
          </button>
        </div>
      </div>
    </div>
  );
};

export default LoginSignup;