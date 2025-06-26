const getAllTasks = async (req, res) => {
    res.status(501).json({
      message: 'Get all tasks endpoint - Coming soon',
      endpoint: 'GET /api/tasks'
    });
  };
  
  const getTaskById = async (req, res) => {
    res.status(501).json({
      message: 'Get task by ID endpoint - Coming soon',
      endpoint: `GET /api/tasks/${req.params.id}`
    });
  };
  
  const createTask = async (req, res) => {
    res.status(501).json({
      message: 'Create task endpoint - Coming soon',
      endpoint: 'POST /api/tasks'
    });
  };
  
  const updateTask = async (req, res) => {
    res.status(501).json({
      message: 'Update task endpoint - Coming soon',
      endpoint: `PUT /api/tasks/${req.params.id}`
    });
  };
  
  const deleteTask = async (req, res) => {
    res.status(501).json({
      message: 'Delete task endpoint - Coming soon',
      endpoint: `DELETE /api/tasks/${req.params.id}`
    });
  };
  
  module.exports = {
    getAllTasks,
    getTaskById,
    createTask,
    updateTask,
    deleteTask
  };