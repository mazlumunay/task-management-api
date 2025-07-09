const express = require('express');
const userController = require('../controllers/userController');
const { getUserAuditLog } = require('../controllers/auditController');
const auth = require('../middleware/auth');

const router = express.Router();

// Apply auth middleware to all user routes
router.use(auth);

// User routes
router.get('/profile', userController.getProfile);
router.put('/profile', userController.updateProfile);
router.get('/audit', getUserAuditLog);

module.exports = router;