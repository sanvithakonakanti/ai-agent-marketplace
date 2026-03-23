// routes/ai.js
// AI processing endpoints for task handling and automation

const express = require('express');
const router = express.Router();
const AgentProcessor = require('../services/agentProcessor');
const AIService = require('../services/aiService');
const Task = require('../models/Task');
const Agent = require('../models/Agent');
const logger = require('../utils/logger');

/**
 * POST /api/ai/process-task
 * Manually process a task with AI
 * Body: { taskId, agentId }
 */
router.post('/process-task', async (req, res) => {
  try {
    const { taskId, agentId } = req.body;

    if (!taskId || !agentId) {
      return res.status(400).json({
        success: false,
        message: 'Missing required fields: taskId, agentId'
      });
    }

    logger.info('AI processing requested', { taskId, agentId });

    // Process the task
    const result = await AgentProcessor.processAssignedTask(taskId, agentId);

    res.status(200).json({
      success: true,
      message: 'Task processed successfully',
      data: {
        taskId: result._id,
        status: result.status,
        result: result.result,
        transactionId: result.transactionId
      }
    });

  } catch (error) {
    logger.error('Task processing failed', error);
    res.status(500).json({
      success: false,
      message: 'Error processing task',
      error: error.message
    });
  }
});

/**
 * POST /api/ai/auto-assign-tasks
 * Automatically assign and process all open tasks
 * Optional query: ?limit=10 (number of tasks to process)
 */
router.post('/auto-assign-tasks', async (req, res) => {
  try {
    logger.info('Auto-assign tasks requested');

    const results = await AgentProcessor.autoAssignTasks();

    // Count successes and failures
    const successful = results.filter(r => r.status === 'processed').length;
    const failed = results.filter(r => r.status === 'failed').length;

    res.status(200).json({
      success: true,
      message: 'Auto-assign process completed',
      data: {
        totalProcessed: results.length,
        successful,
        failed,
        details: results
      }
    });

  } catch (error) {
    logger.error('Auto-assign failed', error);
    res.status(500).json({
      success: false,
      message: 'Error in auto-assign process',
      error: error.message
    });
  }
});

/**
 * GET /api/ai/task-status/:taskId
 * Get current status of a task
 */
router.get('/task-status/:taskId', async (req, res) => {
  try {
    const status = await AgentProcessor.getTaskStatus(req.params.taskId);

    res.status(200).json({
      success: true,
      data: status
    });

  } catch (error) {
    logger.error('Failed to get task status', error);
    res.status(500).json({
      success: false,
      message: 'Error retrieving task status',
      error: error.message
    });
  }
});

/**
 * GET /api/ai/agent-stats/:agentId
 * Get processing statistics for an agent
 */
router.get('/agent-stats/:agentId', async (req, res) => {
  try {
    const stats = await AgentProcessor.getAgentStats(req.params.agentId);

    res.status(200).json({
      success: true,
      data: stats
    });

  } catch (error) {
    logger.error('Failed to get agent stats', error);
    res.status(500).json({
      success: false,
      message: 'Error retrieving agent statistics',
      error: error.message
    });
  }
});

/**
 * GET /api/ai/processing-queue
 * Get current processing queue status
 */
router.get('/processing-queue', async (req, res) => {
  try {
    // Count tasks in different states
    const openTasks = await Task.countDocuments({ status: 'open' });
    const assignedTasks = await Task.countDocuments({ status: 'assigned' });
    const completedTasks = await Task.countDocuments({ status: 'completed' });
    const totalAgents = await Agent.countDocuments({ isActive: true });

    res.status(200).json({
      success: true,
      data: {
        queue: {
          open: openTasks,
          assigned: assignedTasks,
          completed: completedTasks,
          totalPending: openTasks + assignedTasks
        },
        agents: {
          active: totalAgents,
          aiServiceReady: AgentProcessor.isAIServiceReady()
        }
      }
    });

  } catch (error) {
    logger.error('Failed to get processing queue', error);
    res.status(500).json({
      success: false,
      message: 'Error retrieving processing queue',
      error: error.message
    });
  }
});

/**
 * POST /api/ai/test-summarization
 * Test summarization service
 * Body: { text }
 */
router.post('/test-summarization', async (req, res) => {
  try {
    const { text } = req.body;

    if (!text) {
      return res.status(400).json({
        success: false,
        message: 'Missing required field: text'
      });
    }

    logger.info('Testing summarization service');

    const summary = await AIService.summarizeText(text);

    res.status(200).json({
      success: true,
      message: 'Summarization test successful',
      data: {
        originalLength: text.length,
        summaryLength: summary.length,
        summary
      }
    });

  } catch (error) {
    logger.error('Summarization test failed', error);
    res.status(500).json({
      success: false,
      message: 'Error testing summarization',
      error: error.message
    });
  }
});

/**
 * POST /api/ai/test-sentiment
 * Test sentiment analysis service
 * Body: { text }
 */
router.post('/test-sentiment', async (req, res) => {
  try {
    const { text } = req.body;

    if (!text) {
      return res.status(400).json({
        success: false,
        message: 'Missing required field: text'
      });
    }

    logger.info('Testing sentiment analysis service');

    const analysis = await AIService.analyzeSentiment(text);

    res.status(200).json({
      success: true,
      message: 'Sentiment analysis test successful',
      data: analysis
    });

  } catch (error) {
    logger.error('Sentiment test failed', error);
    res.status(500).json({
      success: false,
      message: 'Error testing sentiment analysis',
      error: error.message
    });
  }
});

/**
 * GET /api/ai/health
 * Check AI service health and configuration
 */
router.get('/health', (req, res) => {
  const isConfigured = AIService.isConfigured();

  res.status(200).json({
    success: true,
    data: {
      aiServiceConfigured: isConfigured,
      status: isConfigured ? 'ready' : 'not_configured',
      message: isConfigured 
        ? 'AI service is configured and ready'
        : 'AI service requires GEMINI_API_KEY in .env file',
      instructions: !isConfigured 
        ? [
            '1. Get Gemini API key from https://makersuite.google.com/app/apikey',
            '2. Set GEMINI_API_KEY in backend/.env file',
            '3. Restart backend server'
          ]
        : null
    }
  });
});

module.exports = router;
