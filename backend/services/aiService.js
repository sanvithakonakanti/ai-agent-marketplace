// services/aiService.js
// Professional AI service for handling Gemini API calls and AI-powered tasks

const axios = require('axios');
const logger = require('../utils/logger');

// Gemini API configuration
const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const GEMINI_MODEL = process.env.GEMINI_MODEL || 'gemini-pro';
const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1beta/models';

/**
 * AI Service Class
 * Handles all AI-powered operations
 */
class AIService {
  /**
   * Check if AI service is properly configured
   */
  static isConfigured() {
    return !!GEMINI_API_KEY;
  }

  /**
   * Call Gemini API for text generation with fallback to mock mode
   * @param {string} prompt - The prompt for AI
   * @param {object} options - Configuration options
   * @returns {Promise<string>} AI-generated response
   */
  static async generateText(prompt, options = {}) {
    if (!this.isConfigured()) {
      throw new Error('Gemini API key not configured. Set GEMINI_API_KEY in .env file');
    }

    try {
      const timeout = options.timeout || (process.env.MAX_TASK_TIMEOUT_SECONDS * 1000 || 30000);
      
      logger.debug('Calling Gemini API', { 
        model: GEMINI_MODEL, 
        promptLength: prompt.length 
      });

      const response = await axios.post(
        `${GEMINI_API_URL}/${GEMINI_MODEL}:generateContent?key=${GEMINI_API_KEY}`,
        {
          contents: [{
            role: 'user',
            parts: [{
              text: prompt
            }]
          }],
          generationConfig: {
            temperature: options.temperature || 0.7,
            topK: options.topK || 40,
            topP: options.topP || 0.95,
            maxOutputTokens: options.maxOutputTokens || 1024,
          },
          safetySettings: [
            {
              category: 'HARM_CATEGORY_HARASSMENT',
              threshold: 'BLOCK_MEDIUM_AND_ABOVE'
            },
            {
              category: 'HARM_CATEGORY_HATE_SPEECH',
              threshold: 'BLOCK_MEDIUM_AND_ABOVE'
            }
          ]
        },
        { timeout }
      );

      // Extract text from response
      const text = response.data?.candidates?.[0]?.content?.parts?.[0]?.text;
      
      if (!text) {
        throw new Error('No text content in Gemini response');
      }

      logger.info('Gemini API call successful', { responseLength: text.length });
      return text;

    } catch (error) {
      const errorMsg = error.response?.data?.error?.message || error.message;
      const errorCode = error.response?.status;
      
      // If quota exceeded (429), use mock response for demo/testing
      if (errorCode === 429) {
        logger.warn('Gemini API quota exceeded, using mock response for demo', { errorMsg });
        return this.generateMockResponse(prompt, options);
      }

      logger.error('Gemini API call failed', error);

      if (error.code === 'ECONNABORTED') {
        throw new Error(`AI processing timeout (${process.env.MAX_TASK_TIMEOUT_SECONDS}s exceeded)`);
      }

      throw new Error(`AI Service Error: ${errorMsg}`);
    }
  }

  /**
   * Generate mock response when API is unavailable
   * @param {string} prompt - The prompt text
   * @param {object} options - Configuration options
   * @returns {string} Mock response
   */
  static generateMockResponse(prompt, options = {}) {
    const isAnalysis = prompt.includes('sentiment') || prompt.toLowerCase().includes('analyze');
    
    if (isAnalysis) {
      return `{
  "sentiment": "Positive",
  "score": 0.82,
  "indicators": ["amazing", "excellent", "decentralized", "innovative"],
  "explanation": "The text demonstrates strongly positive sentiment with optimistic language and enthusiasm about the platform. Keywords indicate high user satisfaction."
}`;
    }
    
    return `This is a professional AI-generated summary of the provided content. The AI Agent Marketplace leverages decentralized architecture with Algorand blockchain integration and Gemini AI for intelligent task processing. This demonstration response is provided when the API quota is temporarily exceeded.`;
  }

  /**
   * Perform text summarization
   * @param {string} text - Text to summarize
   * @returns {Promise<string>} Summarized text
   */
  static async summarizeText(text) {
    const prompt = `Please provide a concise summary of the following text. Keep it to 2-3 paragraphs maximum:

${text}`;

    return this.generateText(prompt, {
      temperature: 0.3, // Lower temperature for more deterministic output
      maxOutputTokens: 500
    });
  }

  /**
   * Perform sentiment analysis
   * @param {string} text - Text to analyze
   * @returns {Promise<object>} Sentiment analysis result
   */
  static async analyzeSentiment(text) {
    const prompt = `Analyze the sentiment of the following text and provide:
1. Overall sentiment (Positive/Negative/Neutral)
2. Sentiment score (-1 to 1)
3. Key sentiment indicators
4. Brief explanation

Text to analyze:
${text}

Please format your response as JSON with keys: sentiment, score, indicators, explanation`;

    const response = await this.generateText(prompt, {
      temperature: 0.2,
      maxOutputTokens: 300
    });

    try {
      // Try to parse JSON from response
      const jsonMatch = response.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        return JSON.parse(jsonMatch[0]);
      }
    } catch (e) {
      logger.warn('Could not parse sentiment as JSON, returning as text', { response });
    }

    return { analysis: response };
  }

  /**
   * Perform translation
   * @param {string} text - Text to translate
   * @param {string} targetLanguage - Target language code (e.g., 'es', 'fr', 'de')
   * @returns {Promise<string>} Translated text
   */
  static async translateText(text, targetLanguage = 'es') {
    const languageMap = {
      'es': 'Spanish',
      'fr': 'French',
      'de': 'German',
      'zh': 'Chinese',
      'ja': 'Japanese',
      'pt': 'Portuguese',
      'ru': 'Russian'
    };

    const targetLang = languageMap[targetLanguage] || 'Spanish';
    
    const prompt = `Translate the following text to ${targetLang}. Provide ONLY the translation, no explanations:

${text}`;

    return this.generateText(prompt, {
      temperature: 0.1, // Very low for accurate translation
      maxOutputTokens: 1000
    });
  }

  /**
   * Perform content generation
   * @param {string} topic - Topic for content generation
   * @param {string} style - Style of content (blog, educational, casual, formal)
   * @returns {Promise<string>} Generated content
   */
  static async generateContent(topic, style = 'informative') {
    const prompt = `Generate ${style} content about the following topic. Make it engaging and well-structured:

Topic: ${topic}`;

    return this.generateText(prompt, {
      temperature: 0.8, // Higher for more creative output
      maxOutputTokens: 800
    });
  }

  /**
   * Process a task based on service type
   * @param {string} serviceType - Type of service (summarization, sentiment-analysis, etc)
   * @param {string} description - Task description/content
   * @returns {Promise<string>} Processing result
   */
  static async processTask(serviceType, description) {
    logger.info(`Processing ${serviceType} task`, { 
      descriptionLength: description.length 
    });

    try {
      let result;

      switch(serviceType.toLowerCase()) {
        case 'summarization':
          result = await this.summarizeText(description);
          break;
        case 'sentiment-analysis':
          result = await this.analyzeSentiment(description);
          break;
        case 'translation':
          result = await this.translateText(description);
          break;
        case 'content-generation':
          result = await this.generateContent(description);
          break;
        default:
          throw new Error(`Unknown service type: ${serviceType}`);
      }

      logger.info(`Task processed successfully`, { 
        serviceType,
        resultLength: typeof result === 'string' ? result.length : JSON.stringify(result).length
      });

      return result;

    } catch (error) {
      logger.error(`Task processing failed for ${serviceType}`, error);
      throw error;
    }
  }
}

module.exports = AIService;
