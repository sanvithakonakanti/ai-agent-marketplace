// routes/algorand.js
// Algorand blockchain integration endpoints
// Handles payments, transactions, and blockchain verification

const express = require('express');
const router = express.Router();
const AlgorandService = require('../services/algorandService');
const Task = require('../models/Task');
const Agent = require('../models/Agent');
const logger = require('../utils/logger');

// ============================================================================
// 1. NETWORK ENDPOINTS
// ============================================================================

/**
 * GET /api/algorand/health
 * Check Algorand network connection and configuration
 */
router.get('/health', async (req, res) => {
  try {
    logger.info('Health check requested');

    if (!AlgorandService.isConfigured()) {
      return res.status(503).json({
        success: false,
        status: 'offline',
        message: 'Algorand service not configured'
      });
    }

    const networkStatus = await AlgorandService.getNetworkStatus();
    const config = AlgorandService.getNetworkConfig();

    // Return 200 even if demo mode (for testing)
    res.status(200).json({
      success: true,
      status: 'healthy',
      network: networkStatus,
      config,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    logger.error('Health check failed', error);
    res.status(503).json({
      success: false,
      status: 'offline',
      error: error.message,
      suggestion: 'Ensure ALGORAND_TESTNET_TOKEN is set in .env'
    });
  }
});

/**
 * GET /api/algorand/network
 * Get current network information
 */
router.get('/network', async (req, res) => {
  try {
    logger.info('Network info requested');

    const status = await AlgorandService.getNetworkStatus();
    const config = AlgorandService.getNetworkConfig();

    res.status(200).json({
      success: true,
      network: {
        ...status,
        ...config,
        minBalance: 0.1 // Min 0.1 Algos per account
      }
    });

  } catch (error) {
    logger.error('Failed to get network info', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// ============================================================================
// 2. ACCOUNT ENDPOINTS
// ============================================================================

/**
 * GET /api/algorand/account/:address
 * Get account information and balance
 */
router.get('/account/:address', async (req, res) => {
  try {
    const { address } = req.params;

    logger.info('Account info requested', { address: address.substring(0, 10) });

    // Validate address format
    if (!AlgorandService.validateAddress(address)) {
      return res.status(400).json({
        success: false,
        error: 'Invalid Algorand address format'
      });
    }

    const accountInfo = await AlgorandService.getAccountInfo(address);

    res.status(200).json({
      success: true,
      account: accountInfo
    });

  } catch (error) {
    logger.error('Failed to get account info', error);
    res.status(404).json({
      success: false,
      error: error.message
    });
  }
});

/**
 * POST /api/algorand/account/validate
 * Validate if an address is valid
 */
router.post('/account/validate', (req, res) => {
  try {
    const { address } = req.body;

    if (!address) {
      return res.status(400).json({
        success: false,
        error: 'Address is required'
      });
    }

    const isValid = AlgorandService.validateAddress(address);

    logger.info('Address validation', { 
      address: address.substring(0, 10), 
      isValid 
    });

    res.status(200).json({
      success: true,
      address,
      isValid,
      message: isValid ? 'Valid Algorand address' : 'Invalid Algorand address'
    });

  } catch (error) {
    logger.error('Address validation error', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

/**
 * POST /api/algorand/wallet/generate
 * Generate a test wallet (DEVELOPMENT ONLY)
 * WARNING: Only use for testing, never in production
 */
router.post('/wallet/generate', (req, res) => {
  try {
    logger.warn('Test wallet generation requested');

    const wallet = AlgorandService.generateTestWallet();

    res.status(200).json({
      success: true,
      wallet,
      warning: 'This wallet is for testing only. Do not use with real funds.'
    });

  } catch (error) {
    logger.error('Failed to generate wallet', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// ============================================================================
// 3. PAYMENT ENDPOINTS
// ============================================================================

/**
 * POST /api/algorand/payment/send
 * Send payment from agent to user
 * 
 * Body:
 * - senderAddress: Agent wallet address
 * - senderPrivateKey: Agent private key (base64)
 * - receiverAddress: User wallet address
 * - amount: Payment amount in Algos
 * - taskId: Task ID to record payment
 */
router.post('/payment/send', async (req, res) => {
  try {
    const { 
      senderAddress, 
      senderPrivateKey, 
      receiverAddress, 
      amount, 
      taskId,
      memo 
    } = req.body;

    // Validation
    if (!senderAddress || !senderPrivateKey || !receiverAddress || !amount) {
      return res.status(400).json({
        success: false,
        error: 'Missing required fields: senderAddress, senderPrivateKey, receiverAddress, amount'
      });
    }

    if (amount <= 0) {
      return res.status(400).json({
        success: false,
        error: 'Amount must be greater than 0'
      });
    }

    logger.info('Payment request', { 
      sender: senderAddress.substring(0, 10),
      amount 
    });

    // Send payment
    const paymentResult = await AlgorandService.sendPayment(
      senderAddress,
      senderPrivateKey,
      receiverAddress,
      amount,
      memo || `Task payment - TaskID: ${taskId}`
    );

    // Update task with real transaction ID if taskId provided
    if (taskId) {
      await Task.findByIdAndUpdate(taskId, {
        transactionId: paymentResult.transactionId,
        status: 'completed'
      });

      logger.info('Task updated with blockchain transaction', { 
        taskId, 
        txnId: paymentResult.transactionId 
      });
    }

    res.status(200).json({
      success: true,
      payment: paymentResult
    });

  } catch (error) {
    logger.error('Payment transaction failed', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

/**
 * GET /api/algorand/transaction/:txnId
 * Get transaction status and details
 */
router.get('/transaction/:txnId', async (req, res) => {
  try {
    const { txnId } = req.params;

    logger.info('Transaction info requested', { txnId });

    const txnInfo = await AlgorandService.getTransactionInfo(txnId);

    res.status(200).json({
      success: true,
      transaction: txnInfo
    });

  } catch (error) {
    logger.error('Failed to get transaction info', error);
    res.status(404).json({
      success: false,
      error: error.message
    });
  }
});

// ============================================================================
// 4. SETTLEMENT ENDPOINTS
// ============================================================================

/**
 * POST /api/algorand/settlement/process
 * Process payment settlement for completed tasks
 * 
 * Body:
 * - taskId: Task ID to settle
 * - agentPrivateKey: Agent's wallet private key (base64)
 */
router.post('/settlement/process', async (req, res) => {
  try {
    const { taskId, agentPrivateKey } = req.body;

    if (!taskId || !agentPrivateKey) {
      return res.status(400).json({
        success: false,
        error: 'taskId and agentPrivateKey are required'
      });
    }

    logger.info('Settlement processing requested', { taskId });

    // Get task details
    const task = await Task.findById(taskId).populate('assignedAgent');

    if (!task) {
      return res.status(404).json({
        success: false,
        error: 'Task not found'
      });
    }

    if (task.status !== 'completed') {
      return res.status(400).json({
        success: false,
        error: `Task must be completed. Current status: ${task.status}`
      });
    }

    // Get agent info
    const agent = task.assignedAgent;
    if (!agent || !agent.walletAddress) {
      return res.status(400).json({
        success: false,
        error: 'Agent wallet address not found'
      });
    }

    // Send payment from agent to user
    const paymentResult = await AlgorandService.sendPayment(
      agent.walletAddress,
      agentPrivateKey,
      task.userAddress,
      task.budget,
      `Settlement for task: ${task.title}`
    );

    // Update task with real transaction ID
    task.transactionId = paymentResult.transactionId;
    await task.save();

    logger.info('Settlement completed', { 
      taskId, 
      txnId: paymentResult.transactionId,
      amount: task.budget
    });

    res.status(200).json({
      success: true,
      settlement: {
        taskId,
        transactionId: paymentResult.transactionId,
        amount: task.budget,
        from: agent.walletAddress.substring(0, 10) + '...',
        to: task.userAddress.substring(0, 10) + '...',
        status: 'completed',
        confirmedRound: paymentResult.confirmedRound
      }
    });

  } catch (error) {
    logger.error('Settlement failed', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// ============================================================================
// 5. VERIFICATION ENDPOINTS
// ============================================================================

/**
 * POST /api/algorand/verify/payment
 * Verify a payment transaction
 * 
 * Body:
 * - transactionId: Transaction to verify
 * - expectedAmount: Expected payment amount (optional)
 * - expectedReceiver: Expected receiver address (optional)
 */
router.post('/verify/payment', async (req, res) => {
  try {
    const { transactionId, expectedAmount, expectedReceiver } = req.body;

    if (!transactionId) {
      return res.status(400).json({
        success: false,
        error: 'transactionId is required'
      });
    }

    logger.info('Payment verification requested', { transactionId });

    let verification;
    if (expectedAmount && expectedReceiver) {
      verification = await AlgorandService.verifyPayment(
        transactionId,
        expectedAmount,
        expectedReceiver
      );
    } else {
      const txnInfo = await AlgorandService.getTransactionInfo(transactionId);
      verification = {
        verified: true,
        status: txnInfo.status,
        message: `Transaction status: ${txnInfo.status}`
      };
    }

    res.status(200).json({
      success: true,
      verification
    });

  } catch (error) {
    logger.error('Payment verification failed', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

/**
 * POST /api/algorand/verify/task-settlement
 * Verify if a task has been settled on blockchain
 */
router.post('/verify/task-settlement', async (req, res) => {
  try {
    const { taskId } = req.body;

    if (!taskId) {
      return res.status(400).json({
        success: false,
        error: 'taskId is required'
      });
    }

    logger.info('Task settlement verification requested', { taskId });

    const task = await Task.findById(taskId);

    if (!task) {
      return res.status(404).json({
        success: false,
        error: 'Task not found'
      });
    }

    if (!task.transactionId) {
      return res.status(200).json({
        success: true,
        settled: false,
        message: 'Task not yet settled on blockchain'
      });
    }

    // Verify transaction exists
    const txnInfo = await AlgorandService.getTransactionInfo(task.transactionId);

    res.status(200).json({
      success: true,
      settled: true,
      task: {
        id: task._id,
        title: task.title,
        status: task.status,
        transactionId: task.transactionId,
        amount: task.budget,
        verificationInfo: txnInfo
      }
    });

  } catch (error) {
    logger.error('Task settlement verification failed', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// ============================================================================
// 6. ADMIN ENDPOINTS
// ============================================================================

/**
 * POST /api/algorand/network/switch
 * Switch between TestNet and MainNet (ADMIN ONLY)
 */
router.post('/network/switch', (req, res) => {
  try {
    const { network } = req.body;

    if (!network || !['TESTNET', 'MAINNET'].includes(network)) {
      return res.status(400).json({
        success: false,
        error: 'Invalid network. Choose TESTNET or MAINNET'
      });
    }

    AlgorandService.switchNetwork(network);

    logger.warn(`Network switched to ${network}`, {
      user: 'admin',
      network
    });

    res.status(200).json({
      success: true,
      message: `Switched to ${network}`,
      config: AlgorandService.getNetworkConfig()
    });

  } catch (error) {
    logger.error('Network switch failed', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

/**
 * GET /api/algorand/stats
 * Get blockchain usage statistics
 */
router.get('/stats', async (req, res) => {
  try {
    logger.info('Blockchain stats requested');

    const completedTasks = await Task.countDocuments({ 
      status: 'completed',
      transactionId: { $exists: true, $ne: null }
    });

    const totalTaskBudget = await Task.aggregate([
      { $match: { status: 'completed', transactionId: { $exists: true } } },
      { $group: { _id: null, total: { $sum: '$budget' } } }
    ]);

    const totalProcessed = totalTaskBudget[0]?.total || 0;

    res.status(200).json({
      success: true,
      stats: {
        settledTasks: completedTasks,
        totalAlgosProcessed: totalProcessed,
        network: AlgorandService.currentNetwork.name,
        timestamp: new Date().toISOString()
      }
    });

  } catch (error) {
    logger.error('Failed to get stats', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

module.exports = router;
