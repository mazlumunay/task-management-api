const { v4: uuidv4 } = require('uuid');

const requestLogger = (req, res, next) => {
  // Generate unique request ID
  req.requestId = uuidv4();
  
  // Add request ID to response headers
  res.setHeader('X-Request-ID', req.requestId);
  
  // Log request details
  const startTime = Date.now();
  
  // Get user info if available
  const userId = req.user ? req.user.userId : 'anonymous';
  
  console.log(`[${new Date().toISOString()}] [${req.requestId}] ${req.method} ${req.originalUrl} - User: ${userId} - IP: ${req.ip}`);
  
  // Log request body for non-GET requests (excluding sensitive data)
  if (req.method !== 'GET' && req.body) {
    const logBody = { ...req.body };
    // Remove sensitive fields from logs
    delete logBody.password;
    delete logBody.token;
    console.log(`[${req.requestId}] Request Body:`, JSON.stringify(logBody));
  }
  
  // Override res.json to log response
  const originalJson = res.json;
  res.json = function(data) {
    const duration = Date.now() - startTime;
    console.log(`[${req.requestId}] Response: ${res.statusCode} - ${duration}ms`);
    
    // Log error responses
    if (res.statusCode >= 400) {
      console.log(`[${req.requestId}] Error Response:`, JSON.stringify(data));
    }
    
    return originalJson.call(this, data);
  };
  
  next();
};

module.exports = requestLogger;