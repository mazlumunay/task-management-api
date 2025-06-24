const express = require('express');
const userController = require('../controllers/userController');

const router = express.Router();

// User routes
router.get('/profile', userController.getProfile);
router.put('/profile', userController.updateProfile);

module.exports = router;