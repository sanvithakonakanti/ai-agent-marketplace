// routes/agents.js
// This file contains all API endpoints related to AI Agents

const express = require('express');
const router = express.Router();
const Agent = require('../models/Agent');

// GET - Get all agents
// URL: GET http://localhost:5000/api/agents
// Response: List of all registered agents
router.get('/', async (req, res) => {
  try {
    // Find all active agents
    const agents = await Agent.find({ isActive: true }).select('-__v');
    res.status(200).json({
      success: true,
      message: 'Agents retrieved successfully',
      data: agents,
      count: agents.length
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error retrieving agents',
      error: error.message
    });
  }
});

// GET - Get single agent by ID
// URL: GET http://localhost:5000/api/agents/:id
// Response: Single agent details
router.get('/:id', async (req, res) => {
  try {
    const agent = await Agent.findById(req.params.id).select('-__v');
    if (!agent) {
      return res.status(404).json({
        success: false,
        message: 'Agent not found'
      });
    }
    res.status(200).json({
      success: true,
      data: agent
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error retrieving agent',
      error: error.message
    });
  }
});

// POST - Register a new AI agent
// URL: POST http://localhost:5000/api/agents/register
// Body: { name, description, walletAddress, services }
// Example:
// {
//   "name": "SummaryBot",
//   "description": "Summarizes long texts",
//   "walletAddress": "AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAY5HVY",
//   "services": ["summarization"]
// }
router.post('/register', async (req, res) => {
  try {
    const { name, description, walletAddress, services } = req.body;

    // Validate required fields
    if (!name || !description || !walletAddress || !services) {
      return res.status(400).json({
        success: false,
        message: 'Missing required fields: name, description, walletAddress, services'
      });
    }

    // Check if agent already exists
    const existingAgent = await Agent.findOne({ name });
    if (existingAgent) {
      return res.status(400).json({
        success: false,
        message: 'Agent with this name already exists'
      });
    }

    // Create new agent
    const newAgent = new Agent({
      name,
      description,
      walletAddress,
      services: Array.isArray(services) ? services : [services]
    });

    // Save to database
    await newAgent.save();

    res.status(201).json({
      success: true,
      message: 'Agent registered successfully',
      data: newAgent
    });
  } catch (error) {
    if (error.code === 11000) {
      // Duplicate key error
      res.status(400).json({
        success: false,
        message: 'Agent name already exists'
      });
    } else {
      res.status(500).json({
        success: false,
        message: 'Error registering agent',
        error: error.message
      });
    }
  }
});

// PUT - Update agent information
// URL: PUT http://localhost:5000/api/agents/:id
// Body: { description, services, walletAddress, isActive }
router.put('/:id', async (req, res) => {
  try {
    const { description, services, walletAddress, isActive } = req.body;

    // Find and update agent
    const agent = await Agent.findByIdAndUpdate(
      req.params.id,
      {
        description,
        services,
        walletAddress,
        isActive
      },
      { new: true, runValidators: true }
    );

    if (!agent) {
      return res.status(404).json({
        success: false,
        message: 'Agent not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Agent updated successfully',
      data: agent
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error updating agent',
      error: error.message
    });
  }
});

module.exports = router;
