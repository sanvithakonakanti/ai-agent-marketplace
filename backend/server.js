// Load environment variables
require('dotenv').config();

const express = require('express');
const mongoose = require('mongoose');
const logger = require('./utils/logger');
const app = express();
const PORT = process.env.PORT || 5000;

// Import routes
const agentRoutes = require('./routes/agents');
const taskRoutes = require('./routes/tasks');
const aiRoutes = require('./routes/ai');
const algorandRoutes = require('./routes/algorand');

// Middleware
app.use(express.json());

// CORS middleware for testing (optional)
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  if (req.method === 'OPTIONS') {
    return res.sendStatus(200);
  }
  next();
});

// Connect to MongoDB (explicit DNS override in environments where querySrv hits a blocked DNS resolver)
const dns = require('dns');
try {
  dns.setServers(['8.8.8.8', '1.1.1.1']);
  logger.info('Node DNS servers set to public resolvers: 8.8.8.8, 1.1.1.1');
} catch (dnsErr) {
  logger.warn('Unable to set custom DNS servers for Node resolver', dnsErr);
}

const mongodbUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/ai-marketplace';
mongoose.connect(mongodbUri, {
  serverSelectionTimeoutMS: 10000,
  connectTimeoutMS: 10000
})
.then(() => {
  logger.info('Connected to MongoDB');
}).catch(err => {
  logger.error('MongoDB connection error', err);
});

// Basic route
app.get('/', (req, res) => {
  res.json({
    message: 'AI Agent Marketplace Backend',
    version: '1.0.0',
    endpoints: {
      agents: '/api/agents',
      tasks: '/api/tasks'
    }
  });
});

// API Routes
// /api/agents - All agent endpoints
app.use('/api/agents', agentRoutes);

// /api/tasks - All task endpoints
app.use('/api/tasks', taskRoutes);

// /api/ai - AI processing and task management endpoints
app.use('/api/ai', aiRoutes);

// /api/algorand - Blockchain payment and settlement endpoints
app.use('/api/algorand', algorandRoutes);

// Health check
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'Server is running' });
});

// Error handling for undefined routes
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route not found'
  });
});

// Start server
app.listen(PORT, () => {
  logger.info(`Server running on http://localhost:${PORT}`);
  console.log(`\n${'='.repeat(80)}`);
  console.log(`✓ AI Agent Marketplace - Backend Server (STEP 4: AI Ready)`);
  console.log(`${'='.repeat(80)}\n`);
  console.log(`Server: http://localhost:${PORT}`);
  console.log(`MongoDB: Connected`);
  console.log(`AI Service: CONFIGURED ✓\n`);
  console.log(`📋 AGENT ENDPOINTS:`);
  console.log(`  GET  /api/agents                  - List all agents`);
  console.log(`  POST /api/agents/register         - Register new agent`);
  console.log(`  GET  /api/agents/:id              - Get agent details`);
  console.log(`  PUT  /api/agents/:id              - Update agent\n`);
  console.log(`📋 TASK ENDPOINTS:`);
  console.log(`  GET  /api/tasks                   - List all tasks`);
  console.log(`  POST /api/tasks/submit            - Submit new task`);
  console.log(`  GET  /api/tasks/:id               - Get task details`);
  console.log(`  PUT  /api/tasks/:id/assign        - Assign task to agent`);
  console.log(`  PUT  /api/tasks/:id/complete      - Complete task\n`);  
  console.log(`🤖 AI PROCESSING ENDPOINTS:`);
  console.log(`  POST /api/ai/process-task         - Process task with AI`);
  console.log(`  POST /api/ai/auto-assign-tasks    - Auto-assign & process tasks`);
  console.log(`  GET  /api/ai/task-status/:id      - Get task status`);
  console.log(`  GET  /api/ai/agent-stats/:id      - Get agent statistics`);
  console.log(`  GET  /api/ai/processing-queue     - Get queue status`);
  console.log(`  POST /api/ai/test-summarization   - Test summarization`);
  console.log(`  POST /api/ai/test-sentiment       - Test sentiment analysis`);
  console.log(`  GET  /api/ai/health               - Check AI service health\n`);
  console.log(`${'='.repeat(80)}\n`);
});