const axios = require('axios');

async function testEndpoints() {
  const baseURL = 'http://localhost:5000/api';

  try {
    console.log('🚀 Testing AI Agent Marketplace Endpoints...\n');

    // Test health
    console.log('1. Testing health endpoint...');
    const health = await axios.get(`${baseURL}/health`);
    console.log('✅ Health:', health.data);

    // Test AI
    console.log('\n2. Testing AI summarization...');
    const ai = await axios.post(`${baseURL}/ai/test-summarization`, {
      text: 'This is a test for the AI summarization endpoint in our blockchain marketplace.'
    });
    console.log('✅ AI Response:', ai.data);

    // Test Algorand
    console.log('\n3. Testing Algorand connection...');
    const algo = await axios.get(`${baseURL}/algorand/health`);
    console.log('✅ Algorand:', algo.data);

    console.log('\n🎉 All endpoints are working! The AI Agent Marketplace is fully operational.');
    console.log('\n🌐 Frontend: http://localhost:3000');
    console.log('🔧 Backend: http://localhost:5000');

  } catch (error) {
    console.error('❌ Test failed:', error.message);
    if (error.response) {
      console.error('Response:', error.response.data);
    }
  }
}

testEndpoints();