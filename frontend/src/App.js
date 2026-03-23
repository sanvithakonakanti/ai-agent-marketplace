import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './contexts/AuthContext';
import Home from './pages/Home';
import LoginSignup from './pages/LoginSignup';
import Marketplace from './pages/Marketplace';
import TaskSubmission from './pages/TaskSubmission';
import AIResponse from './pages/AIResponse';
import Processing from './pages/Processing';
import Payment from './pages/Payment';
import Success from './pages/Success';
import Dashboard from './pages/Dashboard';
import AgentRegistration from './pages/AgentRegistration';
import AgentPanel from './pages/AgentPanel';

function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}

function AppContent() {
  const { isAuthenticated, isAgent, isUser, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen app-bg flex items-center justify-center px-6">
        <div className="text-center">
          <div className="h-12 w-12 rounded-full border-2 border-cyan-300/30 border-t-cyan-300 mx-auto mb-4 animate-spin"></div>
          <p className="text-slate-300">Loading marketplace...</p>
        </div>
      </div>
    );
  }

  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<LoginSignup />} />

      {/* Protected Routes */}
      <Route
        path="/marketplace"
        element={isAuthenticated ? <Marketplace /> : <Navigate to="/login" />}
      />
      <Route
        path="/tasks"
        element={isAuthenticated && isUser ? <TaskSubmission /> : <Navigate to="/login" />}
      />
      <Route
        path="/processing"
        element={isAuthenticated && isUser ? <Processing /> : <Navigate to="/login" />}
      />
      <Route
        path="/result"
        element={isAuthenticated && isUser ? <AIResponse /> : <Navigate to="/login" />}
      />
      <Route
        path="/response"
        element={<Navigate to="/result" />}
      />
      <Route
        path="/payment"
        element={isAuthenticated && isUser ? <Payment /> : <Navigate to="/login" />}
      />
      <Route
        path="/success"
        element={isAuthenticated && isUser ? <Success /> : <Navigate to="/login" />}
      />
      <Route
        path="/dashboard"
        element={isAuthenticated && isUser ? <Dashboard /> : <Navigate to="/login" />}
      />
      <Route
        path="/register-agent"
        element={isAuthenticated && isAgent ? <AgentRegistration /> : <Navigate to="/login" />}
      />
      <Route
        path="/agent-panel"
        element={isAuthenticated && isAgent ? <AgentPanel /> : <Navigate to="/login" />}
      />

      {/* Default redirect */}
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
}

export default App;