const express = require('express');
const userController = require('../controllers/userController');
const auth = require('../middleware/auth');

const router = express.Router();

// Apply auth middleware to all user routes
router.use(auth);

// User routes
router.get('/profile', userController.getProfile);
router.put('/profile', userController.updateProfile);

module.exports = router;