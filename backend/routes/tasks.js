// routes/tasks.js
// This file contains all API endpoints related to Tasks

const express = require('express');
const router = express.Router();
const Task = require('../models/Task');
const Agent = require('../models/Agent');

// GET - Get all tasks
// URL: GET http://localhost:5000/api/tasks
// Optional query: ?status=open (filter by status)
// Response: List of all tasks (optionally filtered)
router.get('/', async (req, res) => {
  try {
    const { status } = req.query;
    
    // Build filter object
    const filter = {};
    if (status) {
      filter.status = status;
    }

    // Find tasks with filter
    const tasks = await Task.find(filter)
      .populate('assignedAgent', 'name reputation')
      .select('-__v')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      message: 'Tasks retrieved successfully',
      data: tasks,
      count: tasks.length
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error retrieving tasks',
      error: error.message
    });
  }
});

// GET - Get single task by ID
// URL: GET http://localhost:5000/api/tasks/:id
// Response: Single task details with agent info
router.get('/:id', async (req, res) => {
  try {
    const task = await Task.findById(req.params.id)
      .populate('assignedAgent', 'name reputation')
      .select('-__v');

    if (!task) {
      return res.status(404).json({
        success: false,
        message: 'Task not found'
      });
    }

    res.status(200).json({
      success: true,
      data: task
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error retrieving task',
      error: error.message
    });
  }
});

// POST - Submit a new task
// URL: POST http://localhost:5000/api/tasks/submit
// Body: { title, description, serviceType, userAddress, budget }
// Example:
// {
//   "title": "Summarize my article",
//   "description": "Please summarize this long article about blockchain...",
//   "serviceType": "summarization",
//   "userAddress": "BBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBY5HVY",
//   "budget": 5.0
// }
router.post('/submit', async (req, res) => {
  try {
    const { title, description, serviceType, userAddress, budget } = req.body;

    // Validate required fields
    if (!title || !description || !serviceType || !userAddress || !budget) {
      return res.status(400).json({
        success: false,
        message: 'Missing required fields: title, description, serviceType, userAddress, budget'
      });
    }

    // Validate budget is positive
    if (budget <= 0) {
      return res.status(400).json({
        success: false,
        message: 'Budget must be greater than 0'
      });
    }

    // Create new task
    const newTask = new Task({
      title,
      description,
      serviceType,
      userAddress,
      budget,
      status: 'open'
    });

    // Save to database
    await newTask.save();

    res.status(201).json({
      success: true,
      message: 'Task submitted successfully',
      data: newTask
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error submitting task',
      error: error.message
    });
  }
});

// PUT - Assign task to an agent
// URL: PUT http://localhost:5000/api/tasks/:id/assign
// Body: { agentId }
// Example: { "agentId": "65abc123def456..." }
router.put('/:id/assign', async (req, res) => {
  try {
    const { agentId } = req.body;

    if (!agentId) {
      return res.status(400).json({
        success: false,
        message: 'Missing required field: agentId'
      });
    }

    // Check if agent exists
    const agent = await Agent.findById(agentId);
    if (!agent) {
      return res.status(404).json({
        success: false,
        message: 'Agent not found'
      });
    }

    // Update task
    const task = await Task.findByIdAndUpdate(
      req.params.id,
      {
        assignedAgent: agentId,
        status: 'assigned'
      },
      { new: true, runValidators: true }
    ).populate('assignedAgent', 'name reputation');

    if (!task) {
      return res.status(404).json({
        success: false,
        message: 'Task not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Task assigned successfully',
      data: task
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error assigning task',
      error: error.message
    });
  }
});

// PUT - Complete task and store result
// URL: PUT http://localhost:5000/api/tasks/:id/complete
// Body: { result, transactionId }
// Example:
// {
//   "result": "Here is the summary: ...",
//   "transactionId": "AXJ7JD6KFJFLKD..."
// }
router.put('/:id/complete', async (req, res) => {
  try {
    const { result, transactionId } = req.body;

    if (!result || !transactionId) {
      return res.status(400).json({
        success: false,
        message: 'Missing required fields: result, transactionId'
      });
    }

    // Find task
    const task = await Task.findById(req.params.id);
    if (!task) {
      return res.status(404).json({
        success: false,
        message: 'Task not found'
      });
    }

    // Update task
    task.status = 'completed';
    task.result = result;
    task.transactionId = transactionId;
    task.completedAt = new Date();
    await task.save();

    // Update agent stats
    if (task.assignedAgent) {
      await Agent.findByIdAndUpdate(
        task.assignedAgent,
        {
          $inc: {
            tasksCompleted: 1,
            totalEarnings: task.budget
          }
        }
      );
    }

    const updatedTask = await task.populate('assignedAgent', 'name reputation');

    res.status(200).json({
      success: true,
      message: 'Task completed successfully',
      data: updatedTask
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error completing task',
      error: error.message
    });
  }
});

module.exports = router;
