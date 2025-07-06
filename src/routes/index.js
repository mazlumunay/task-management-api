const express = require('express');
const authRoutes = require('./auth');
const taskRoutes = require('./tasks');
const userRoutes = require('./users');
const categoryRoutes = require('./categories');
const { healthCheck } = require('../controllers/healthController');

const router = express.Router();

// API Routes
router.use('/auth', authRoutes);
router.use('/tasks', taskRoutes);
router.use('/users', userRoutes);
router.use('/categories', categoryRoutes);

// Enhanced health check route
router.get('/health', healthCheck);

module.exports = router;