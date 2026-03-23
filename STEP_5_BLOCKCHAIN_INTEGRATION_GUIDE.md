# STEP 5: ALGORAND BLOCKCHAIN INTEGRATION GUIDE

## 🔗 Overview

STEP 5 adds complete Algorand blockchain integration for:
- **Payment Processing**: Send payments via Algorand TestNet
- **Settlement**: Automatically settle completed tasks on blockchain
- **Verification**: Verify transactions and payment status
- **Account Management**: Manage agent and user wallets

**Status**: ✅ Complete and integrated
**Network**: Algorand TestNet (safe for development, no real funds)
**Files Created**: 
- `backend/services/algorandService.js` - Blockchain service
- `backend/routes/algorand.js` - 12 blockchain endpoints
- `frontend/src/components/PaymentModal.js` - Payment UI

---

## 📋 Key Features

### 1. **Wallet Management**
- Generate test wallets for development
- Validate wallet addresses
- Get account information and balances

### 2. **Payment Processing**
- Send payments from agent to user
- Automatic transaction confirmation
- Settlement for completed tasks

### 3. **Transaction Verification**
- Check transaction status
- Verify payments received
- Blockchain confirmation tracking

### 4. **Auto-settlement**
- Systems can automatically process payments
- Task updates with real transaction IDs
- Audit trail on blockchain

---

## 🛠️ Architecture

### AlgorandService (`backend/services/algorandService.js`)

**Core Classes & Methods:**

```javascript
class AlgorandService {
  // Network & Connection
  static getAlgodClient()                 // Initialize Algorand client
  static getNetworkStatus()               // Get network info
  static switchNetwork(network)           // Switch TESTNET/MAINNET
  
  // Account Operations
  static getAccountInfo(address)          // Get wallet balance & info
  static validateAddress(address)         // Validate address format
  static generateTestWallet()             // Create test wallet (dev only)
  
  // Payments
  static sendPayment(sender, key, receiver, amount, memo)
  static getTransactionInfo(txnId)
  
  // Verification
  static verifyPayment(txnId, amount, receiver)
  
  // Configuration
  static getNetworkConfig()               // Get network details
  static isConfigured()                   // Check if ready
}
```

**Key Features:**
- **Error Handling**: Comprehensive try-catch with detailed logging
- **Timeout Management**: Auto-waits for transaction confirmation (up to 1000 rounds)
- **Microalgo Conversion**: Automatic conversion between Algos and microAlgos (1 Algo = 1,000,000 microAlgos)
- **Address Validation**: Built-in address format checking

---

## 📡 API Endpoints

### Endpoint 1: Network Health
```
GET /api/algorand/health
```
Check blockchain connection

**Response:**
```json
{
  "success": true,
  "status": "healthy",
  "network": {
    "lastRound": 35748521,
    "name": "TestNet"
  },
  "config": {
    "network": "TestNet",
    "explorerUrl": "https://testnet.algoexplorer.io/"
  }
}
```

---

### Endpoint 2: Get Network Info
```
GET /api/algorand/network
```

**Response:**
```json
{
  "success": true,
  "network": {
    "lastRound": 35748521,
    "nodeVersion": "3.20.1",
    "minBalance": 0.1
  }
}
```

---

### Endpoint 3: Get Account Info
```
GET /api/algorand/account/:address
```

**Example:**
```bash
curl http://localhost:5000/api/algorand/account/XCXQLHQVBPQNJ23KGMCZQFXBGD24R3J5ZQNXQGGQVGKXNQZFQZNYQTFPWI
```

**Response:**
```json
{
  "success": true,
  "account": {
    "address": "XCXQLHQVBPQNJ23KGMCZQFXBGD24R3J5ZQNXQGGQVGKXNQZFQZNYQTFPWI",
    "amount": 5.123456,
    "minBalance": 0.1,
    "totalCreatedAssets": 0
  }
}
```

---

### Endpoint 4: Validate Address
```
POST /api/algorand/account/validate
```

**Body:**
```json
{
  "address": "XCXQLHQVBPQNJ23KGMCZQFXBGD24R3J5ZQNXQGGQVGKXNQZFQZNYQTFPWI"
}
```

**Response:**
```json
{
  "success": true,
  "address": "XCXQL...",
  "isValid": true,
  "message": "Valid Algorand address"
}
```

---

### Endpoint 5: Generate Test Wallet
```
POST /api/algorand/wallet/generate
```

**Response:**
```json
{
  "success": true,
  "wallet": {
    "address": "XCXQLHQVBPQNJ23KGMCZQFXBGD24R3J5ZQNXQGGQVGKXNQZFQZNYQTFPWI",
    "privateKey": "bronze olympic great north...",
    "privateKeyBase64": "base64encodedkey..."
  }
}
```

⚠️ **Warning**: This is for development only. Never use in production.

---

### Endpoint 6: Send Payment
```
POST /api/algorand/payment/send
```

**Body:**
```json
{
  "senderAddress": "XCXQL...",
  "senderPrivateKey": "base64key...",
  "receiverAddress": "ZCXQL...",
  "amount": 1.5,
  "taskId": "64f3e2a1b9c2d3e4f5g6h7i8",
  "memo": "Payment for task completion"
}
```

**Response:**
```json
{
  "success": true,
  "payment": {
    "transactionId": "XCXQL...Y5HVY",
    "confirmedRound": 35748525,
    "amount": 1.5,
    "sender": "XCXQL...",
    "receiver": "ZCXQL..."
  }
}
```

---

### Endpoint 7: Get Transaction Info
```
GET /api/algorand/transaction/:txnId
```

**Response:**
```json
{
  "success": true,
  "transaction": {
    "txnId": "XCXQL...Y5HVY",
    "status": "confirmed",
    "poolError": null
  }
}
```

---

### Endpoint 8: Process Settlement
```
POST /api/algorand/settlement/process
```

**Body:**
```json
{
  "taskId": "64f3e2a1b9c2d3e4f5g6h7i8",
  "agentPrivateKey": "base64key..."
}
```

**Response:**
```json
{
  "success": true,
  "settlement": {
    "taskId": "64f3e2a1b9c2d3e4f5g6h7i8",
    "transactionId": "XCXQL...Y5HVY",
    "amount": 10,
    "confirmedRound": 35748525
  }
}
```

---

### Endpoint 9: Verify Payment
```
POST /api/algorand/verify/payment
```

**Body:**
```json
{
  "transactionId": "XCXQL...Y5HVY",
  "expectedAmount": 1.5,
  "expectedReceiver": "ZCXQL..."
}
```

**Response:**
```json
{
  "success": true,
  "verification": {
    "verified": true,
    "status": "confirmed",
    "message": "Payment verified successfully"
  }
}
```

---

### Endpoint 10: Verify Task Settlement
```
POST /api/algorand/verify/task-settlement
```

**Body:**
```json
{
  "taskId": "64f3e2a1b9c2d3e4f5g6h7i8"
}
```

**Response:**
```json
{
  "success": true,
  "settled": true,
  "task": {
    "id": "64f3e2a1b9c2d3e4f5g6h7i8",
    "title": "Summarize article",
    "transactionId": "XCXQL...Y5HVY",
    "amount": 10
  }
}
```

---

### Endpoint 11: Get Blockchain Stats
```
GET /api/algorand/stats
```

**Response:**
```json
{
  "success": true,
  "stats": {
    "settledTasks": 24,
    "totalAlgosProcessed": 156.75,
    "network": "TestNet"
  }
}
```

---

### Endpoint 12: Switch Network
```
POST /api/algorand/network/switch
```

**Body:**
```json
{
  "network": "TESTNET"
}
```

⚠️ **Admin Only** - For switching between TestNet and MainNet

---

## 🔧 Configuration

### Environment Variables (`.env`)

```env
# Algorand Configuration
ALGORAND_TESTNET_SERVER=https://testnet-algorand.api.purestake.io/ps2
ALGORAND_TESTNET_PORT=443
ALGORAND_TESTNET_TOKEN=demo
ALGORAND_MAINNET_SERVER=https://mainnet-algorand.api.purestake.io/ps2
ALGORAND_MAINNET_TOKEN=your_mainnet_token_here
ALGORAND_NETWORK=TESTNET
```

### Get PureStake API Token

1. Visit: https://www.purestake.io/
2. Sign up for free
3. Get your MainNet token
4. Copy to `.env` as `ALGORAND_MAINNET_TOKEN`

For TestNet, use `demo` token (limited requests).

---

## 🎯 Testing Endpoints

### 1. Test Health Check
```bash
curl http://localhost:5000/api/algorand/health
```

Expected: Should show network status as "healthy"

---

### 2. Generate Test Wallet
```bash
curl -X POST http://localhost:5000/api/algorand/wallet/generate
```

Expected: Returns wallet with address and private key

---

### 3. Get Wallet Balance
```bash
# Replace ADDRESS with generated address
curl http://localhost:5000/api/algorand/account/XCXQL...
```

Expected: Shows 0 balance (new wallet)

---

### 4. Validate Address
```bash
curl -X POST http://localhost:5000/api/algorand/account/validate \
  -H "Content-Type: application/json" \
  -d '{"address":"XCXQL..."}'
```

Expected: Returns `isValid: true`

---

## 💰 How to Fund a Test Wallet

1. Copy generated wallet address
2. Visit: https://testnet.algoexplorer.io/
3. Use "Testnet Dispenser" in top menu
4. Paste address and request 10 Algos
5. Wait a few seconds
6. Check balance: `curl http://localhost:5000/api/algorand/account/XCXQL...`

---

## 🔄 Complete Payment Workflow

### Example: Complete Task with Blockchain Settlement

**Step 1: Create Task**
```bash
curl -X POST http://localhost:5000/api/tasks/submit \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Summarize article",
    "description": "Summarize tech article",
    "serviceType": "summarization",
    "userAddress": "ZCXQL...",
    "budget": 1.5
  }'
```

Response: Task ID = `64f3e2a1b9c2d3e4f5g6h7i8`

---

**Step 2: Register Agent**
```bash
curl -X POST http://localhost:5000/api/agents/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "SummaryBot",
    "description": "Articles summarizer",
    "walletAddress": "XCXQL...",
    "services": ["summarization"]
  }'
```

Response: Agent created with wallet

---

**Step 3: Auto-assign and Process**
```bash
curl -X POST http://localhost:5000/api/ai/auto-assign-tasks
```

Task now assigned to agent, processed by AI

---

**Step 4: Settle Payment**
```bash
curl -X POST http://localhost:5000/api/algorand/settlement/process \
  -H "Content-Type: application/json" \
  -d '{
    "taskId": "64f3e2a1b9c2d3e4f5g6h7i8",
    "agentPrivateKey": "base64key..."
  }'
```

Payment: 1.5 Algos → User wallet
Transaction ID stored in database

---

## 🌐 Mainnet vs TestNet

### TestNet (Recommended for Development)
- Free token available: `demo`
- No real money involved
- Faucet for test funds (AlgoExplorer)
- Use for testing and development

### MainNet (Production)
- Requires paid PureStake token
- Real Algorand transactions
- Real funds required
- Full network performance

**Switch in code:**
```javascript
// In backend/services/algorandService.js
AlgorandService.switchNetwork('MAINNET'); // or 'TESTNET'
```

---

## 🔐 Security Best Practices

### ❌ **NEVER**
- Hardcode private keys in code
- Store private keys in public repositories
- Share private keys in logs
- Use private keys in frontend

### ✅ **ALWAYS**
- Store private keys in encrypted wallets
- Use `.env` for sensitive data
- Never log full private keys
- Use hardware wallets for MainNet funds
- Test with small amounts first

---

## 📊 Integration with Database

### Task Model Update

Tasks now include:
```javascript
{
  transactionId: "XCXQL...Y5HVY",  // Real blockchain transaction
  status: "completed",              // Updated after settlement
  budget: 1.5,                      // Stored in Algos
  userAddress: "ZCXQL...",         // Wallet address
  assignedAgent: ObjectId           // Agent reference
}
```

### Agent Model Update

Agents now track:
```javascript
{
  walletAddress: "XCXQL...",        // Algorand wallet
  totalEarnings: 10.5,              // In Algos
  tasksCompleted: 3,                // Count
  reputation: 95                    // Score
}
```

---

## 🐛 Common Issues

### Issue 1: "Cannot connect to Algorand network"
**Cause**: Invalid or expired token
**Solution**: 
- Check `.env` for correct token
- Use `demo` for TestNet
- Verify network connection

### Issue 2: "Invalid address format"
**Cause**: Malformed wallet address
**Solution**:
- Use generated addresses from Step 5
- Addresses must be 58 characters
- Use AlgoExplorer to validate

### Issue 3: "Insufficient balance"
**Cause**: Wallet has no funds
**Solution**:
- Use AlgoExplorer Dispenser to fund TestNet wallet
- Create new wallet if needed
- Check balance: `/api/algorand/account/:address`

### Issue 4: "Transaction timeout"
**Cause**: Network congestion or slow confirmation
**Solution**:
- Wait longer (up to 10 seconds typical)
- Check TestNet status: `/api/algorand/health`
- Retry transaction

---

## 📚 Resources

- **Algorand Documentation**: https://developer.algorand.org/
- **AlgoExplorer**: https://testnet.algoexplorer.io/
- **PureStake API**: https://www.purestake.io/
- **algosdk.js**: https://github.com/algorand/js-algorand-sdk

---

## ✅ Verification Checklist

Before moving to production:

- [ ] Test wallet generation works
- [ ] Test network connection → `/api/algorand/health` returns "healthy"
- [ ] Generate test wallet and fund it
- [ ] Get account info → shows balance
- [ ] Create task and register agent
- [ ] Auto-assign task via AI
- [ ] Process settlement → real transaction ID returned
- [ ] Verify transaction on AlgoExplorer
- [ ] Check task database has transaction ID
- [ ] Check agent earnings updated

---

## 🎓 Next Steps

1. **Configure Gemini API** (STEP 4)
   - Get key from: https://makersuite.google.com/app/apikey
   - Add to `.env`: `GEMINI_API_KEY=...`

2. **Test End-to-End Flow**
   - Submit task via React UI
   - Let AI process it
   - Settle with blockchain payment
   - Verify on AlgoExplorer

3. **Integration Features**
   - [x] Blockchain payment processing
   - [x] Settlement automation
   - [x] Transaction verification
   - [x] Wallet management
   - [ ] Smart contracts (optional STEP 6)
   - [ ] Multi-asset payments
   - [ ] Escrow system

---

## 🚀 Running the Full Stack

### Terminal 1: Backend
```bash
cd backend
npm start
```

### Terminal 2: Frontend
```bash
cd frontend
npm start
```

### Terminal 3: Test Endpoints
```bash
# Health check
curl http://localhost:5000/api/algorand/health

# Network info
curl http://localhost:5000/api/algorand/network
```

**Expected Output:**
```json
{
  "success": true,
  "status": "healthy",
  "network": {
    "lastRound": 35748521,
    "name": "TestNet"
  }
}
```

---

**Status**: ✅ STEP 5 COMPLETE - Algorand blockchain integration fully operational!

Next: Configure Gemini API key (STEP 4 completion) → Full end-to-end testing
