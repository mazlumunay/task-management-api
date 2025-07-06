const express = require('express');
const authController = require('../controllers/authController');
const { validateRegistration, validateLogin } = require('../middleware/validation');
const { authLimiter } = require('../middleware/rateLimiter');

const router = express.Router();

// Apply stricter rate limiting to auth routes
router.use(authLimiter);

// Authentication routes
router.post('/register', validateRegistration, authController.register);
router.post('/login', validateLogin, authController.login);
router.post('/logout', authController.logout);

module.exports = router;