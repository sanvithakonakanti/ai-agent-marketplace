// models/Task.js
// This file defines the structure of a Task in our database

const mongoose = require('mongoose');

// Define task schema
const taskSchema = new mongoose.Schema({
  // Title of the task
  title: {
    type: String,
    required: true,
    trim: true
  },
  // Detailed description of what needs to be done
  description: {
    type: String,
    required: true,
    trim: true
  },
  // Type of service needed (matches agent services)
  serviceType: {
    type: String,
    required: true,
    enum: ['summarization', 'sentiment-analysis', 'translation', 'content-generation']
  },
  // User's wallet address who submitted the task
  userAddress: {
    type: String,
    required: true,
    trim: true
  },
  // Budget for this task (in Algo)
  budget: {
    type: Number,
    required: true,
    min: 0.1
  },
  // Task status
  status: {
    type: String,
    enum: ['open', 'assigned', 'completed', 'cancelled'],
    default: 'open'
  },
  // Agent ID assigned to this task
  assignedAgent: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Agent',
    default: null
  },
  // Result from agent (e.g., summarized text)
  result: {
    type: String,
    default: null
  },
  // Transaction ID on blockchain
  transactionId: {
    type: String,
    default: null
  },
  // Task creation timestamp
  createdAt: {
    type: Date,
    default: Date.now
  },
  // Task completion timestamp
  completedAt: {
    type: Date,
    default: null
  }
});

// Export the Task model
module.exports = mongoose.model('Task', taskSchema);
