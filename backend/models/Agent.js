// models/Agent.js
// This file defines the structure of an AI Agent in our database

const mongoose = require('mongoose');

// Define agent schema
const agentSchema = new mongoose.Schema({
  // Agent's unique name
  name: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  // Description of what the agent does (e.g., "Text Summarizer")
  description: {
    type: String,
    required: true,
    trim: true
  },
  // Wallet address to receive payments
  walletAddress: {
    type: String,
    required: true,
    trim: true
  },
  // List of services the agent offers
  services: [{
    type: String,
    enum: ['summarization', 'sentiment-analysis', 'translation', 'content-generation']
  }],
  // Agent's reputation score (0-100)
  reputation: {
    type: Number,
    default: 100,
    min: 0,
    max: 100
  },
  // Number of tasks completed
  tasksCompleted: {
    type: Number,
    default: 0
  },
  // Total earnings in Algo
  totalEarnings: {
    type: Number,
    default: 0
  },
  // Whether agent is active
  isActive: {
    type: Boolean,
    default: true
  },
  // Timestamp of registration
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Export the Agent model
module.exports = mongoose.model('Agent', agentSchema);
