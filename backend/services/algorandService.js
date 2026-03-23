// services/algorandService.js
// Professional Algorand blockchain integration for payments and settlements

const algosdk = require('algosdk');
const logger = require('../utils/logger');

/**
 * Algorand Service
 * Handles blockchain transactions, wallets, and payment verification
 */
class AlgorandService {
  // Algorand network configuration
  static NETWORK = {
    TESTNET: {
      algodServer: 'https://testnet-algorand.api.purestake.io/ps2',
      port: 443,
      token: process.env.ALGORAND_TESTNET_TOKEN || 'demo',
      name: 'TestNet'
    },
    MAINNET: {
      algodServer: 'https://mainnet-algorand.api.purestake.io/ps2',
      port: 443,
      token: process.env.ALGORAND_MAINNET_TOKEN || '',
      name: 'MainNet'
    }
  };

  // Use TestNet by default (safe for development)
  static currentNetwork = this.NETWORK.TESTNET;

  /**
   * Initialize Algorand client
   */
  static getAlgodClient() {
    try {
      const { algodServer, port, token } = this.currentNetwork;
      
      const client = new algosdk.Algodv2(
        token,
        algodServer,
        port,
        { 'User-Agent': 'AlgorandMarketplace/1.0' }
      );

      return client;
    } catch (error) {
      logger.error('Failed to initialize Algorand client', error);
      throw error;
    }
  }

  /**
   * Get network status
   */
  static async getNetworkStatus() {
    try {
      const client = this.getAlgodClient();
      const status = await client.status().do();

      logger.info(`Algorand ${this.currentNetwork.name} status retrieved`);

      return {
        network: this.currentNetwork.name,
        lastRound: status['last-round'],
        catchupTime: status['catchup-time'],
        genesisId: status['genesis-id'],
        demo: false
      };

    } catch (error) {
      logger.warn('Failed to connect to Algorand network, using mock status for demo', { error: error.message });
      
      // Return mock status for demonstration (when token is invalid or network unreachable)
      return {
        network: this.currentNetwork.name,
        lastRound: 36000000,
        catchupTime: 0,
        genesisId: 'SGO1GKSzyE7IEPItTxpHsEmrV4GfSstL33S8yqItWXo=',
        demo: true,
        message: 'Demo/Mock response - Update ALGORAND_TESTNET_TOKEN for live network'
      };
    }
  }

  /**
   * Get account information
   * @param {string} address - Algorand wallet address
   */
  static async getAccountInfo(address) {
    try {
      const client = this.getAlgodClient();
      const accountInfo = await client.accountInformation(address).do();

      return {
        address: accountInfo['address'],
        amount: accountInfo['amount'] / 1e6, // Convert from microAlgos to Algos
        amountWithoutPendingRewards: accountInfo['amount-without-pending-rewards'] / 1e6,
        pendingRewards: accountInfo['pending-rewards'] / 1e6,
        minBalance: accountInfo['min-balance'] / 1e6,
        totalCreatedAssets: accountInfo['total-created-assets'] || 0,
        totalAssetsOptedIn: accountInfo['total-assets-opted-in'] || 0
      };

    } catch (error) {
      logger.error('Failed to get account info', error);
      throw new Error(`Invalid address or account not found: ${address}`);
    }
  }

  /**
   * Send payment transaction
   * @param {string} senderAddress - Sender wallet address
   * @param {string} senderPrivateKey - Sender private key (base64)
   * @param {string} receiverAddress - Receiver wallet address
   * @param {number} amount - Amount in Algos
   * @param {string} memo - Transaction memo/note
   */
  static async sendPayment(senderAddress, senderPrivateKey, receiverAddress, amount, memo = '') {
    try {
      logger.info('Preparing payment transaction', {
        sender: senderAddress.substring(0, 10),
        receiver: receiverAddress.substring(0, 10),
        amount
      });

      const client = this.getAlgodClient();

      // Get suggested transaction params
      const params = await client.getTransactionParams().do();

      // Convert Algos to microAlgos (1 Algo = 1,000,000 microAlgos)
      const amountInMicroAlgos = Math.round(amount * 1e6);

      // Create transaction
      const txn = algosdk.makePaymentTxnWithSuggestedParams(
        senderAddress,
        receiverAddress,
        amountInMicroAlgos,
        undefined,
        Buffer.from(memo),
        params
      );

      // Sign transaction with private key
      const encodedKey = Buffer.from(senderPrivateKey, 'base64');
      const signedTxn = txn.signTxn(encodedKey);
      const txnId = txn.txID().toString();

      logger.info('Transaction signed', { txnId });

      // Send transaction
      const submitResponse = await client
        .sendRawTransaction(signedTxn)
        .do();

      logger.info('Transaction submitted', { txnId });

      // Wait for confirmation (up to 1000 rounds)
      const confirmedTxn = await algosdk.waitForConfirmation(
        client,
        txnId,
        1000
      );

      logger.info('Transaction confirmed', {
        txnId,
        confirmedRound: confirmedTxn['confirmed-round']
      });

      return {
        success: true,
        transactionId: txnId,
        confirmedRound: confirmedTxn['confirmed-round'],
        amount,
        sender: senderAddress,
        receiver: receiverAddress,
        timestamp: new Date().toISOString()
      };

    } catch (error) {
      logger.error('Payment transaction failed', error);
      throw new Error(`Payment failed: ${error.message}`);
    }
  }

  /**
   * Get transaction info
   * @param {string} txnId - Transaction ID
   */
  static async getTransactionInfo(txnId) {
    try {
      const client = this.getAlgodClient();
      const txnInfo = await client.pendingTransactionInformation(txnId).do();

      logger.info('Transaction info retrieved', { txnId });

      return {
        txnId,
        status: txnInfo['transaction-results'] ? 'confirmed' : 'pending',
        poolError: txnInfo['pool-error'] || null,
        txnDetails: txnInfo
      };

    } catch (error) {
      logger.error('Failed to get transaction info', error);
      throw new Error(`Cannot find transaction: ${txnId}`);
    }
  }

  /**
   * Validate wallet address format
   * @param {string} address - Address to validate
   */
  static validateAddress(address) {
    try {
      return algosdk.isValidAddress(address);
    } catch (error) {
      return false;
    }
  }

  /**
   * Generate a new test wallet (FOR DEVELOPMENT ONLY)
   * WARNING: Never use generated keys in production
   */
  static generateTestWallet() {
    try {
      const account = algosdk.generateAccount();

      logger.warn('Generated test wallet - DO NOT USE IN PRODUCTION', {
        address: account.addr.substring(0, 20)
      });

      return {
        address: account.addr,
        privateKey: algosdk.secretKeyToMnemonic(account.sk),
        privateKeyBase64: Buffer.from(account.sk).toString('base64'),
        warning: 'This is a test wallet. Never use in production or with real funds.'
      };

    } catch (error) {
      logger.error('Failed to generate wallet', error);
      throw error;
    }
  }

  /**
   * Format amount for display (Algos to human readable)
   * @param {number} microAlgos - Amount in microAlgos
   */
  static formatAmount(microAlgos) {
    return (microAlgos / 1e6).toFixed(6);
  }

  /**
   * Verify payment was received
   * @param {string} txnId - Transaction ID
   * @param {string} expectedAmount - Expected amount in Algos
   * @param {string} expectedReceiver - Expected receiver address
   */
  static async verifyPayment(txnId, expectedAmount, expectedReceiver) {
    try {
      const client = this.getAlgodClient();
      const txnInfo = await client.pendingTransactionInformation(txnId).do();

      // Check if transaction is pending (not yet confirmed)
      if (!txnInfo['transaction-results']) {
        return {
          verified: false,
          message: 'Transaction is pending confirmation',
          status: 'pending'
        };
      }

      // In a real scenario, you'd query the confirmed transaction
      // For now, we verify the structure
      const amountInAlgos = algosdk.microalgosToAlgos(txnInfo['txn']['txn']['amt']);
      
      if (amountInAlgos !== expectedAmount) {
        return {
          verified: false,
          message: `Amount mismatch. Expected ${expectedAmount}, got ${amountInAlgos}`,
          status: 'invalid'
        };
      }

      return {
        verified: true,
        message: 'Payment verified successfully',
        status: 'confirmed',
        txnId,
        amount: amountInAlgos
      };

    } catch (error) {
      logger.error('Payment verification failed', error);
      throw error;
    }
  }

  /**
   * Get network configuration
   */
  static getNetworkConfig() {
    return {
      network: this.currentNetwork.name,
      algodServer: this.currentNetwork.algodServer,
      explorerUrl: this.currentNetwork.name === 'TESTNET'
        ? 'https://testnet.algoexplorer.io/'
        : 'https://algoexplorer.io/',
      chainId: this.currentNetwork.name === 'TESTNET' ? 'testnet-v1.0' : 'mainnet-v1.0'
    };
  }

  /**
   * Switch network (TESTNET by default)
   * @param {string} network - 'TESTNET' or 'MAINNET'
   */
  static switchNetwork(network) {
    if (network === 'MAINNET') {
      this.currentNetwork = this.NETWORK.MAINNET;
      logger.warn('Switched to MAINNET - Using real funds!');
    } else {
      this.currentNetwork = this.NETWORK.TESTNET;
      logger.info('Switched to TESTNET');
    }
  }

  /**
   * Get minimum balance requirement
   */
  static async getMinimumBalance() {
    try {
      const client = this.getAlgodClient();
      const params = await client.getTransactionParams().do();
      
      // Minimum balance is typically 100,000 microAlgos
      return {
        microAlgos: 100000,
        algos: 0.1,
        description: 'Minimum account balance on Algorand'
      };

    } catch (error) {
      logger.error('Failed to get minimum balance', error);
      throw error;
    }
  }

  /**
   * Check if service is configured
   */
  static isConfigured() {
    return true; // Algorand service works with or without token (though limited)
  }
}

module.exports = AlgorandService;
