const prisma = require('../config/database');

// Get all tasks for the authenticated user
const getAllTasks = async (req, res) => {
  try {
    const tasks = await prisma.task.findMany({
      where: { userId: req.user.userId },
      include: { category: true },
      orderBy: { createdAt: 'desc' }
    });
    res.json(tasks);
  } catch (error) {
    console.error('Get all tasks error:', error);
    res.status(500).json({ error: 'Failed to fetch tasks' });
  }
};

// Get a single task by ID (must belong to user)
const getTaskById = async (req, res) => {
  try {
    const task = await prisma.task.findFirst({
      where: { id: Number(req.params.id), userId: req.user.userId },
      include: { category: true }
    });
    if (!task) return res.status(404).json({ error: 'Task not found' });
    res.json(task);
  } catch (error) {
    console.error('Get task by ID error:', error);
    res.status(500).json({ error: 'Failed to fetch task' });
  }
};

// Create a new task
const createTask = async (req, res) => {
  try {
    const { title, description, completed, priority, dueDate, categoryId } = req.body;
    const task = await prisma.task.create({
      data: {
        title,
        description,
        completed: completed ?? false,
        priority: priority || 'MEDIUM',
        dueDate: dueDate ? new Date(dueDate) : undefined,
        userId: req.user.userId,
        categoryId: categoryId ? Number(categoryId) : undefined
      },
      include: { category: true }
    });
    res.status(201).json(task);
  } catch (error) {
    console.error('Create task error:', error);
    res.status(500).json({ error: 'Failed to create task' });
  }
};

// Update an existing task (must belong to user)
const updateTask = async (req, res) => {
  try {
    const { title, description, completed, priority, dueDate, categoryId } = req.body;
    const task = await prisma.task.updateMany({
      where: { id: Number(req.params.id), userId: req.user.userId },
      data: {
        title,
        description,
        completed,
        priority,
        dueDate: dueDate ? new Date(dueDate) : undefined,
        categoryId: categoryId ? Number(categoryId) : undefined
      }
    });
    if (task.count === 0) return res.status(404).json({ error: 'Task not found or not yours' });
    const updated = await prisma.task.findUnique({ where: { id: Number(req.params.id) }, include: { category: true } });
    res.json(updated);
  } catch (error) {
    console.error('Update task error:', error);
    res.status(500).json({ error: 'Failed to update task' });
  }
};

// Delete a task (must belong to user)
const deleteTask = async (req, res) => {
  try {
    const task = await prisma.task.deleteMany({
      where: { id: Number(req.params.id), userId: req.user.userId }
    });
    if (task.count === 0) return res.status(404).json({ error: 'Task not found or not yours' });
    res.json({ message: 'Task deleted' });
  } catch (error) {
    console.error('Delete task error:', error);
    res.status(500).json({ error: 'Failed to delete task' });
  }
};

module.exports = {
  getAllTasks,
  getTaskById,
  createTask,
  updateTask,
  deleteTask
};