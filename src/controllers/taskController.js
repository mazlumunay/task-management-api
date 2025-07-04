const prisma = require('../config/database');

// Get all tasks for the authenticated user with filtering
const getAllTasks = async (req, res) => {
  try {
    const { completed, priority, category, search, sortBy = 'createdAt', order = 'desc' } = req.query;
    
    // Build where clause
    const where = { userId: req.user.userId };
    
    if (completed !== undefined) {
      where.completed = completed === 'true';
    }
    
    if (priority) {
      where.priority = priority;
    }
    
    if (category) {
      where.categoryId = parseInt(category);
    }
    
    if (search) {
      where.OR = [
        { title: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } }
      ];
    }
    
    // Build order clause
    const orderBy = {};
    if (sortBy === 'dueDate') {
      orderBy.dueDate = order;
    } else if (sortBy === 'priority') {
      orderBy.priority = order;
    } else if (sortBy === 'title') {
      orderBy.title = order;
    } else {
      orderBy.createdAt = order;
    }
    
    const tasks = await prisma.task.findMany({
      where,
      include: { category: true },
      orderBy
    });
    
    res.json({
      tasks,
      count: tasks.length,
      filters: { completed, priority, category, search, sortBy, order }
    });
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

// Get task statistics for the authenticated user
const getTaskStats = async (req, res) => {
  try {
    const userId = req.user.userId;
    
    // Get total counts
    const totalTasks = await prisma.task.count({ where: { userId } });
    const completedTasks = await prisma.task.count({ 
      where: { userId, completed: true } 
    });
    const pendingTasks = totalTasks - completedTasks;
    
    // Get priority breakdown
    const priorityStats = await prisma.task.groupBy({
      by: ['priority'],
      where: { userId },
      _count: { priority: true }
    });
    
    // Get overdue tasks
    const overdueTasks = await prisma.task.count({
      where: {
        userId,
        completed: false,
        dueDate: { lt: new Date() }
      }
    });
    
    // Get tasks due today
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    
    const tasksDueToday = await prisma.task.count({
      where: {
        userId,
        completed: false,
        dueDate: {
          gte: today.toISOString().split('T')[0],
          lt: tomorrow.toISOString().split('T')[0]
        }
      }
    });
    
    // Get recent activity (tasks created in last 7 days)
    const weekAgo = new Date();
    weekAgo.setDate(weekAgo.getDate() - 7);
    
    const recentTasks = await prisma.task.count({
      where: {
        userId,
        createdAt: { gte: weekAgo }
      }
    });
    
    res.json({
      overview: {
        totalTasks,
        completedTasks,
        pendingTasks,
        completionRate: totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0
      },
      priorities: priorityStats.reduce((acc, stat) => {
        acc[stat.priority] = stat._count.priority;
        return acc;
      }, {}),
      urgent: {
        overdueTasks,
        tasksDueToday
      },
      activity: {
        recentTasks
      }
    });
  } catch (error) {
    console.error('Get task stats error:', error);
    res.status(500).json({ error: 'Failed to fetch task statistics' });
  }
};

module.exports = {
  getAllTasks,
  getTaskById,
  createTask,
  updateTask,
  deleteTask,
  getTaskStats
};