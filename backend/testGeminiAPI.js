// Test Gemini API directly
require('dotenv').config();
const axios = require('axios');

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const GEMINI_MODEL = process.env.GEMINI_MODEL || 'gemini-pro';

console.log('Testing Gemini API Configuration...');
console.log('API Key:', GEMINI_API_KEY ? `${GEMINI_API_KEY.substring(0, 20)}...` : 'NOT SET');
console.log('Model:', GEMINI_MODEL);
console.log('');

if (!GEMINI_API_KEY) {
  console.error('ERROR: GEMINI_API_KEY not set in .env');
  process.exit(1);
}

async function testGemini() {
  try {
    console.log('Sending request to Gemini API...');
    const response = await axios.post(
      `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent?key=${GEMINI_API_KEY}`,
      {
        contents: [{
          role: 'user',
          parts: [{
            text: 'Please summarize this in one sentence: The AI Agent Marketplace enables decentralized task processing.'
          }]
        }],
        generationConfig: {
          temperature: 0.3,
          maxOutputTokens: 500,
        }
      },
      { timeout: 10000 }
    );

    console.log('SUCCESS! Gemini API is working');
    console.log('Response:', JSON.stringify(response.data, null, 2).substring(0, 300));
    process.exit(0);

  } catch (error) {
    console.error('ERROR: Gemini API call failed');
    console.error('Status:', error.response?.status);
    console.error('Error message:', error.response?.data?.error?.message || error.message);
    console.error('Full error:', JSON.stringify(error.response?.data || error.message, null, 2).substring(0, 500));
    process.exit(1);
  }
}

testGemini();
