// services/agentProcessor.js
// Professional agent task processor service

const AIService = require('./aiService');
const Task = require('../models/Task');
const Agent = require('../models/Agent');
const logger = require('../utils/logger');

/**
 * Agent Processor Service
 * Handles automatic task processing by agents
 */
class AgentProcessor {
  /**
   * Process a task assigned to an agent
   * Calls AI service and updates task with result
   * @param {string} taskId - Task ID to process
   * @param {string} agentId - Agent ID processing the task
   * @returns {Promise<object>} Updated task with result
   */
  static async processAssignedTask(taskId, agentId) {
    let task = null;
    let agent = null;

    try {
      logger.info('Starting task processing', { taskId, agentId });

      // Find task
      task = await Task.findById(taskId);
      if (!task) {
        throw new Error('Task not found');
      }

      // Find agent
      agent = await Agent.findById(agentId);
      if (!agent) {
        throw new Error('Agent not found');
      }

      // Check if task is already being processed
      if (task.status === 'completed') {
        logger.warn('Task already completed', { taskId });
        throw new Error('Task is already completed');
      }

      // Update task status to processing
      task.status = 'assigned';
      await task.save();

      logger.info('Processing task with AI Service', { 
        serviceType: task.serviceType,
        agentName: agent.name
      });

      // Call AI service based on service type
      const result = await AIService.processTask(task.serviceType, task.description);

      // Format result based on service type
      let formattedResult = result;
      if (typeof result === 'object') {
        formattedResult = JSON.stringify(result, null, 2);
      }

      // Update task with result (transaction ID would come from blockchain in STEP 5)
      task.result = formattedResult;
      task.status = 'completed';
      task.completedAt = new Date();
      // In a real scenario, transactionId would come from blockchain payment confirmation
      task.transactionId = this.generateMockTransactionId();
      await task.save();

      logger.info('Task processing completed successfully', { taskId });

      // Update agent statistics
      await Agent.findByIdAndUpdate(
        agentId,
        {
          $inc: {
            tasksCompleted: 1,
            totalEarnings: task.budget
          }
        }
      );

      logger.info('Agent statistics updated', { 
        agentId, 
        tasksBefore: agent.tasksCompleted, 
        tasksAfter: agent.tasksCompleted + 1 
      });

      return task;

    } catch (error) {
      logger.error('Task processing failed', error);

      // Update task status to failed if needed
      if (task) {
        task.status = 'open'; // Reset to open so other agents can try
        task.assignedAgent = null;
        await task.save().catch(err => logger.error('Failed to update task on error', err));
      }

      throw error;
    }
  }

  /**
   * Auto-assign open tasks to available agents
   * This could be called periodically
   * @returns {Promise<array>} List of processing results
   */
  static async autoAssignTasks() {
    try {
      logger.info('Starting auto-assign task process');

      // Find all open tasks
      const openTasks = await Task.find({ status: 'open' }).limit(10);
      if (openTasks.length === 0) {
        logger.info('No open tasks to assign');
        return [];
      }

      const results = [];

      for (const task of openTasks) {
        try {
          // Find an agent that offers the required service
          const agent = await Agent.findOne({
            services: task.serviceType,
            isActive: true
          });

          if (!agent) {
            logger.warn('No available agent for service', { serviceType: task.serviceType });
            continue;
          }

          // Assign and process task
          const result = await this.processAssignedTask(task._id, agent._id);
          results.push({
            taskId: task._id,
            status: 'processed',
            message: 'Task processed successfully'
          });

          logger.info('Task auto-assigned and processed', { 
            taskId: task._id, 
            agentId: agent._id 
          });

        } catch (error) {
          logger.warn('Failed to process task in auto-assign', { taskId: task._id }, error);
          results.push({
            taskId: task._id,
            status: 'failed',
            error: error.message
          });
        }
      }

      logger.info(`Auto-assign completed: ${results.length} tasks processed`);
      return results;

    } catch (error) {
      logger.error('Auto-assign task process failed', error);
      throw error;
    }
  }

  /**
   * Get task processing status
   * @param {string} taskId - Task ID
   * @returns {Promise<object>} Task processing status
   */
  static async getTaskStatus(taskId) {
    try {
      const task = await Task.findById(taskId)
        .populate('assignedAgent', 'name reputation');

      if (!task) {
        throw new Error('Task not found');
      }

      return {
        taskId: task._id,
        title: task.title,
        status: task.status,
        serviceType: task.serviceType,
        assignedAgent: task.assignedAgent,
        budget: task.budget,
        createdAt: task.createdAt,
        completedAt: task.completedAt,
        hasResult: !!task.result,
        resultPreview: task.result ? task.result.substring(0, 100) : null
      };

    } catch (error) {
      logger.error('Failed to get task status', error);
      throw error;
    }
  }

  /**
   * Get agent processing statistics
   * @param {string} agentId - Agent ID
   * @returns {Promise<object>} Agent processing statistics
   */
  static async getAgentStats(agentId) {
    try {
      const agent = await Agent.findById(agentId);
      if (!agent) {
        throw new Error('Agent not found');
      }

      // Get completed tasks count
      const completedTasks = await Task.countDocuments({
        assignedAgent: agentId,
        status: 'completed'
      });

      // Get average task completion time
      const tasks = await Task.find({
        assignedAgent: agentId,
        status: 'completed'
      }).sort({ completedAt: -1 }).limit(10);

      let avgCompletionTime = 0;
      if (tasks.length > 0) {
        const times = tasks.map(t => 
          (new Date(t.completedAt) - new Date(t.createdAt)) / 1000
        );
        avgCompletionTime = (times.reduce((a, b) => a + b, 0) / times.length).toFixed(2);
      }

      return {
        agentId: agent._id,
        agentName: agent.name,
        totalTasksCompleted: agent.tasksCompleted,
        totalEarnings: agent.totalEarnings.toFixed(2),
        reputation: agent.reputation,
        averageCompletionTime: `${avgCompletionTime}s`,
        services: agent.services,
        isActive: agent.isActive
      };

    } catch (error) {
      logger.error('Failed to get agent stats', error);
      throw error;
    }
  }

  /**
   * Generate mock transaction ID (in real scenario, this comes from blockchain)
   * @returns {string} Mock transaction ID
   */
  static generateMockTransactionId() {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let result = '';
    for (let i = 0; i < 58; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result + 'Y5HVY'; // Algorand address suffix
  }

  /**
   * Check if AI service is properly configured
   * @returns {boolean} Is AI service configured
   */
  static isAIServiceReady() {
    return AIService.isConfigured();
  }
}

module.exports = AgentProcessor;
