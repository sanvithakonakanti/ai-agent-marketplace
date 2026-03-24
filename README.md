
# AI Agent Marketplace on Blockchain

## Overview
A modern, clean, and beginner-friendly decentralized AI Agent Marketplace built with React, Tailwind CSS, Node.js, and Algorand blockchain.

### Key Features
- **User Authentication**: Separate login for Users and AI Agents
- **Marketplace**: Browse and select AI agents by category
- **Task Submission**: Easy-to-use interface for submitting tasks
- **AI Responses**: Chat-style interface showing AI responses
- **Secure Payments**: Blockchain-based payments using ALGO cryptocurrency
- **Agent Dashboard**: Manage services, view earnings, and task history
- **User Dashboard**: Track tasks, payments, and history
- **Responsive Design**: Mobile-friendly interface

### Technology Stack
- **Frontend**: React 18 + Tailwind CSS + React Router
- **Backend**: Node.js + Express + MongoDB Atlas
- **AI**: Google Gemini API (with fallback)
- **Blockchain**: Algorand TestNet (with mock fallback)
- **Authentication**: Local storage (demo) / JWT (production)

## Quick Start

### Prerequisites
- Node.js 16+
- MongoDB Atlas account
- Google Gemini API key
- Algorand PureStake API key (optional for demo)

### Installation

1. **Clone the repository**
   ```bash
   git clone <repo-url>
   cd "vision protectors"
   ```

2. **Backend Setup**
   ```bash
   cd backend
   npm install
   cp .env.example .env  # Fill in your API keys
   npm start
   ```

3. **Frontend Setup**
   ```bash
   cd ../frontend
   npm install
   npm start
   ```

### Environment Variables

Create `backend/.env` with:

```env
# Server
PORT=5000
NODE_ENV=development

# Database
MONGODB_URI=mongodb+srv://<username>:<password>@<cluster>.mongodb.net/<dbname>

# AI
GEMINI_API_KEY=your_gemini_api_key_here
GEMINI_MODEL=gemini-2.0-flash

# Blockchain (use mock tokens for demo)
ALGORAND_TESTNET_TOKEN=mock-token-for-testing
ALGORAND_TESTNET_SERVER=https://testnet-algorand.api.purestake.io/ps2
ALGORAND_TESTNET_PORT=443
```

## User Flow

### For Users:
1. **Home** → View platform overview
2. **Login/Signup** → Create user account
3. **Marketplace** → Browse AI agents
4. **Task Submission** → Submit task to selected agent
5. **AI Response** → View AI-generated response
6. **Payment** → Pay with ALGO on Algorand
7. **Dashboard** → Track tasks and payments

### For AI Agents:
1. **Home** → Platform overview
2. **Login/Signup** → Create agent account
3. **Agent Registration** → Register AI service
4. **Dashboard** → Manage services and view earnings

## API Endpoints

### Authentication
- `POST /api/auth/login` - User/Agent login
- `POST /api/auth/register` - User/Agent registration

### Agents
- `GET /api/agents` - List all agents
- `POST /api/agents` - Register new agent
- `GET /api/agents/:id` - Get agent details

### Tasks
- `POST /api/tasks` - Submit new task
- `GET /api/tasks` - Get user's tasks
- `GET /api/tasks/:id` - Get task details

### AI
- `POST /api/ai/generate` - Generate AI response
- `POST /api/ai/test-summarization` - Test summarization

### Blockchain
- `GET /api/algorand/health` - Check Algorand connection
- `POST /api/algorand/payment` - Process ALGO payment

## Fallback Modes

### AI Fallback
- If Gemini API quota exceeded → Returns mock response
- Error message: "AI service temporarily unavailable"

### Blockchain Fallback
- If Algorand API fails → Uses demo mode
- Mock transactions for testing

## Demo Script

Run this Node.js script to test all endpoints:

```javascript
// test-endpoints.js
const axios = require('axios');

async function testEndpoints() {
  const baseURL = 'http://localhost:5000/api';

  try {
    // Test health
    console.log('Testing health...');
    const health = await axios.get(`${baseURL}/health`);
    console.log('✓ Health:', health.data);

    // Test AI
    console.log('Testing AI...');
    const ai = await axios.post(`${baseURL}/ai/test-summarization`, {
      text: 'Test text for summarization'
    });
    console.log('✓ AI Response:', ai.data);

    // Test Algorand
    console.log('Testing Algorand...');
    const algo = await axios.get(`${baseURL}/algorand/health`);
    console.log('✓ Algorand:', algo.data);

    console.log('All tests passed! 🎉');
  } catch (error) {
    console.error('Test failed:', error.message);
  }
}

testEndpoints();
```

## Production Deployment

1. **Replace API Keys**
   - Get real Gemini API key
   - Get Algorand PureStake token
   - Set up production MongoDB

2. **Environment Setup**
   ```env
   NODE_ENV=production
   GEMINI_API_KEY=your_real_key
   ALGORAND_TESTNET_TOKEN=your_real_token
   ```

3. **Build Frontend**
   ```bash
   cd frontend
   npm run build
   ```

4. **Deploy**
   - Backend: Heroku, Railway, or VPS
   - Frontend: Netlify, Vercel, or CDN
   - Database: MongoDB Atlas

## Contributing

1. Fork the repository
2. Create feature branch
3. Make changes
4. Test thoroughly
5. Submit pull request

## License

MIT License - see LICENSE file for details

## Demo

The application is designed for easy demonstration:
- Clean, intuitive UI
- Fast loading times
- Clear user flows
- Mobile responsive
- Error handling with fallbacks

Perfect for hackathons and presentations! 🚀
2. Install backend dependencies
   ```bash
   cd backend
   npm install
   ```
3. Install frontend dependencies
   ```bash
   cd ../frontend
   npm install
   ```

## Environment variables
Fill `backend/.env` with values:

```env
PORT=5000
NODE_ENV=development

MONGODB_URI=mongodb+srv://<username>:<password>@<your-cluster>.mongodb.net/<dbname>?retryWrites=true&w=majority

GEMINI_API_KEY=your_gemini_api_key
GEMINI_MODEL=gemini-2.0-flash

ALGORAND_TESTNET_SERVER=https://testnet-algorand.api.purestake.io/ps2
ALGORAND_TESTNET_PORT=443
ALGORAND_TESTNET_TOKEN=your_purestake_testnet_token
ALGORAND_MAINNET_SERVER=https://mainnet-algorand.api.purestake.io/ps2
ALGORAND_MAINNET_PORT=443
ALGORAND_MAINNET_TOKEN=your_mainnet_token_here
ALGORAND_NETWORK=TESTNET
ALGORAND_MIN_TX_TIMEOUT=10

MAX_TASK_TIMEOUT_SECONDS=30
AI_PROCESSING_ENABLED=true
LOG_LEVEL=info
```

### Required Atlas config
- Add your IP to Atlas IP Access List, or use `0.0.0.0/0` for development.

## Known fallback modes
- **Gemini quota**: if Google Gemini returns 429, `services/aiService.js` falls back to a mock response for summarization/sentiment.
- **Algorand offline**: if Algorand TestNet is unreachable or token invalid, `services/algorandService.js` returns a demo network status (mock data) and health returns success.

## Run
1. Start backend
   ```bash
   cd backend
   node server.js
   ```
2. Start frontend
   ```bash
   cd ../frontend
   npm start
   ```
3. Open UI
   - [http://localhost:3000](http://localhost:3000)

## Step 6+7 test script
Create and run as a script or use Python snippet (for copy/paste):

```bash
cd "c:/Users/reddy/OneDrive/Desktop/vision protectors"
node - <<'NODE'
const fetch = require('node-fetch');
async function doTest(){
  const endpoints=[
    {name:'Backend Health', url:'http://localhost:5000/health', method:'GET'},
    {name:'AI Health', url:'http://localhost:5000/api/ai/health', method:'GET'},
    {name:'AI Summarization', url:'http://localhost:5000/api/ai/test-summarization', method:'POST', body:{text:'AI Agent Marketplace test'} },
    {name:'AI Sentiment', url:'http://localhost:5000/api/ai/test-sentiment', method:'POST', body:{text:'Great system!'} },
    {name:'List Agents', url:'http://localhost:5000/api/agents', method:'GET'},
    {name:'List Tasks', url:'http://localhost:5000/api/tasks', method:'GET'},
    {name:'Algorand Health', url:'http://localhost:5000/api/algorand/health', method:'GET'},
    {name:'Frontend UI', url:'http://localhost:3000/', method:'GET'}
  ];
  for(const ep of endpoints){
    try{
      const opts={method: ep.method, headers:{'Content-Type':'application/json'}};
      if(ep.body){ opts.body=JSON.stringify(ep.body); }
      const res = await fetch(ep.url, opts);
      console.log(`${ep.name}: ${res.status}`);
    }catch(err){
      console.error(`${ep.name}: ERR`, err.message);
    }
  }
}
doTest();
NODE
```

## Notes
- `backend/services/aiService.js` handles quota fallback.
- `backend/services/algorandService.js` handles Algorand network disconnect with a demo state.
- If using real payments, replace mock tokens and remove fallback snippet.
=======
# ai-agent-marketplace
blockchain decentralized application
>>>>>>> c762a4ed9450bc103ce6a729a0b8cf346e1f5328
