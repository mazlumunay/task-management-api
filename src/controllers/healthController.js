const prisma = require('../config/database');

const healthCheck = async (req, res) => {
  try {
    // Check database connection
    await prisma.$queryRaw`SELECT 1`;
    
    // Get basic stats
    const userCount = await prisma.user.count();
    const taskCount = await prisma.task.count();
    const categoryCount = await prisma.category.count();
    
    res.json({
      status: 'OK',
      message: 'Task Management API is running',
      timestamp: new Date().toISOString(),
      version: '1.0.0',
      database: {
        status: 'connected',
        users: userCount,
        tasks: taskCount,
        categories: categoryCount
      },
      uptime: process.uptime(),
      memory: process.memoryUsage(),
      environment: process.env.NODE_ENV || 'development'
    });
  } catch (error) {
    console.error('Health check failed:', error);
    res.status(503).json({
      status: 'ERROR',
      message: 'Service unavailable',
      timestamp: new Date().toISOString(),
      database: {
        status: 'disconnected'
      }
    });
  }
};

module.exports = {
  healthCheck
};