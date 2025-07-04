const express = require('express');
const taskController = require('../controllers/taskController');
const auth = require('../middleware/auth');
const { validateCreateTask, validateUpdateTask } = require('../middleware/taskValidation');

const router = express.Router();

// Apply auth middleware to all task routes
router.use(auth);

// Task statistics (place before /:id route)
router.get('/stats', taskController.getTaskStats);

// Task CRUD routes
router.get('/', taskController.getAllTasks);
router.get('/:id', taskController.getTaskById);
router.post('/', validateCreateTask, taskController.createTask);
router.put('/:id', validateUpdateTask, taskController.updateTask);
router.delete('/:id', taskController.deleteTask);

module.exports = router;