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

// Bulk operations for tasks
const bulkUpdateTasks = async (req, res) => {
  try {
    const { taskIds, updates } = req.body;
    
    if (!Array.isArray(taskIds) || taskIds.length === 0) {
      return res.status(400).json({ error: 'taskIds must be a non-empty array' });
    }

    // Verify all tasks belong to the user
    const userTasks = await prisma.task.findMany({
      where: {
        id: { in: taskIds.map(id => Number(id)) },
        userId: req.user.userId
      },
      select: { id: true }
    });

    if (userTasks.length !== taskIds.length) {
      return res.status(403).json({ error: 'Some tasks do not belong to you or do not exist' });
    }

    // Prepare update data
    const updateData = {};
    if (updates.completed !== undefined) updateData.completed = updates.completed;
    if (updates.priority) updateData.priority = updates.priority;
    if (updates.categoryId !== undefined) updateData.categoryId = updates.categoryId ? Number(updates.categoryId) : null;

    // Perform bulk update
    const result = await prisma.task.updateMany({
      where: {
        id: { in: taskIds.map(id => Number(id)) },
        userId: req.user.userId
      },
      data: updateData
    });

    // Get updated tasks
    const updatedTasks = await prisma.task.findMany({
      where: {
        id: { in: taskIds.map(id => Number(id)) },
        userId: req.user.userId
      },
      include: { category: true }
    });

    res.json({
      message: `${result.count} tasks updated successfully`,
      updatedCount: result.count,
      tasks: updatedTasks
    });
  } catch (error) {
    console.error('Bulk update tasks error:', error);
    res.status(500).json({ error: 'Failed to update tasks' });
  }
};

const bulkDeleteTasks = async (req, res) => {
  try {
    const { taskIds } = req.body;
    
    if (!Array.isArray(taskIds) || taskIds.length === 0) {
      return res.status(400).json({ error: 'taskIds must be a non-empty array' });
    }

    // Verify all tasks belong to the user before deletion
    const userTasks = await prisma.task.findMany({
      where: {
        id: { in: taskIds.map(id => Number(id)) },
        userId: req.user.userId
      },
      select: { id: true, title: true }
    });

    if (userTasks.length === 0) {
      return res.status(404).json({ error: 'No tasks found or none belong to you' });
    }

    // Perform bulk delete
    const result = await prisma.task.deleteMany({
      where: {
        id: { in: userTasks.map(task => task.id) },
        userId: req.user.userId
      }
    });

    res.json({
      message: `${result.count} tasks deleted successfully`,
      deletedCount: result.count,
      deletedTasks: userTasks
    });
  } catch (error) {
    console.error('Bulk delete tasks error:', error);
    res.status(500).json({ error: 'Failed to delete tasks' });
  }
};

// Add to module.exports
module.exports = {
  getAllTasks,
  getTaskById,
  createTask,
  updateTask,
  deleteTask,
  getTaskStats,
  bulkUpdateTasks,
  bulkDeleteTasks
};
