const getAllCategories = async (req, res) => {
    res.status(501).json({
      message: 'Get all categories endpoint - Coming soon',
      endpoint: 'GET /api/categories'
    });
  };
  
  const createCategory = async (req, res) => {
    res.status(501).json({
      message: 'Create category endpoint - Coming soon',
      endpoint: 'POST /api/categories'
    });
  };
  
  const updateCategory = async (req, res) => {
    res.status(501).json({
      message: 'Update category endpoint - Coming soon',
      endpoint: `PUT /api/categories/${req.params.id}`
    });
  };
  
  const deleteCategory = async (req, res) => {
    res.status(501).json({
      message: 'Delete category endpoint - Coming soon',
      endpoint: `DELETE /api/categories/${req.params.id}`
    });
  };
  
  module.exports = {
    getAllCategories,
    createCategory,
    updateCategory,
    deleteCategory
  };