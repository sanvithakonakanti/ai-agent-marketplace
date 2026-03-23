// utils/logger.js
// Professional logging utility for debugging and monitoring

const LOG_LEVELS = {
  DEBUG: 0,
  INFO: 1,
  WARN: 2,
  ERROR: 3,
  FATAL: 4
};

// Get log level from environment (default: INFO)
const CURRENT_LOG_LEVEL = LOG_LEVELS[process.env.LOG_LEVEL?.toUpperCase() || 'INFO'];

/**
 * Formats timestamp for logs
 * @returns {string} ISO timestamp
 */
function getTimestamp() {
  return new Date().toISOString();
}

/**
 * Formats log message with timestamp and level
 * @param {string} level - Log level
 * @param {string} message - Log message
 * @param {object} data - Additional data to log
 * @returns {string} Formatted log message
 */
function formatLog(level, message, data = null) {
  const timestamp = getTimestamp();
  const dataStr = data ? ` | ${JSON.stringify(data)}` : '';
  return `[${timestamp}] [${level}] ${message}${dataStr}`;
}

const logger = {
  /**
   * Log debug message
   */
  debug: (message, data) => {
    if (CURRENT_LOG_LEVEL <= LOG_LEVELS.DEBUG) {
      console.log(formatLog('DEBUG', message, data));
    }
  },

  /**
   * Log info message
   */
  info: (message, data) => {
    if (CURRENT_LOG_LEVEL <= LOG_LEVELS.INFO) {
      console.log(formatLog('INFO', message, data));
    }
  },

  /**
   * Log warning message
   */
  warn: (message, data) => {
    if (CURRENT_LOG_LEVEL <= LOG_LEVELS.WARN) {
      console.warn(formatLog('WARN', message, data));
    }
  },

  /**
   * Log error message
   */
  error: (message, error) => {
    if (CURRENT_LOG_LEVEL <= LOG_LEVELS.ERROR) {
      const errorData = error instanceof Error ? {
        message: error.message,
        stack: error.stack
      } : error;
      console.error(formatLog('ERROR', message, errorData));
    }
  },

  /**
   * Log fatal error
   */
  fatal: (message, error) => {
    const errorData = error instanceof Error ? {
      message: error.message,
      stack: error.stack
    } : error;
    console.error(formatLog('FATAL', message, errorData));
  }
};

module.exports = logger;
