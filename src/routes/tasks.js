const express = require('express');
const taskController = require('../controllers/taskController');
const auth = require('../middleware/auth');

const router = express.Router();

// Apply auth middleware to all task routes
router.use(auth);

// Task CRUD routes
router.get('/', taskController.getAllTasks);
router.get('/:id', taskController.getTaskById);
router.post('/', taskController.createTask);
router.put('/:id', taskController.updateTask);
router.delete('/:id', taskController.deleteTask);

module.exports = router;