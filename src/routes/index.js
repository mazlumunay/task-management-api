const express = require('express');
const authRoutes = require('./auth');
const taskRoutes = require('./tasks');
const userRoutes = require('./users');
const categoryRoutes = require('./categories');

const router = express.Router();

// API Routes
router.use('/auth', authRoutes);
router.use('/tasks', taskRoutes);
router.use('/users', userRoutes);
router.use('/categories', categoryRoutes);

// Health check route
router.get('/health', (req, res) => {
  res.json({
    status: 'OK',
    message: 'Task Management API is running',
    timestamp: new Date().toISOString(),
    version: '1.0.0'
  });
});

module.exports = router;