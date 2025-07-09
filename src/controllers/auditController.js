const prisma = require('../config/database');

// Get audit logs for the current user (last 100 actions)
const getUserAuditLog = async (req, res) => {
  try {
    // This would require an audit_logs table - for now, return recent tasks activity
    const recentTasks = await prisma.task.findMany({
      where: { userId: req.user.userId },
      orderBy: { updatedAt: 'desc' },
      take: 50,
      select: {
        id: true,
        title: true,
        completed: true,
        priority: true,
        createdAt: true,
        updatedAt: true
      }
    });

    // Transform to audit-like format
    const auditLog = recentTasks.map(task => ({
      id: task.id,
      action: task.createdAt.getTime() === task.updatedAt.getTime() ? 'created' : 'updated',
      resource: 'task',
      resourceId: task.id,
      resourceTitle: task.title,
      timestamp: task.updatedAt,
      details: {
        completed: task.completed,
        priority: task.priority
      }
    }));

    res.json({
      auditLog,
      count: auditLog.length,
      message: 'Recent activity log'
    });
  } catch (error) {
    console.error('Get audit log error:', error);
    res.status(500).json({ error: 'Failed to fetch audit log' });
  }
};

module.exports = {
  getUserAuditLog
};