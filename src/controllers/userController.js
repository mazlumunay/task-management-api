const getProfile = async (req, res) => {
    res.status(501).json({
      message: 'Get user profile endpoint - Coming soon',
      endpoint: 'GET /api/users/profile'
    });
  };
  
  const updateProfile = async (req, res) => {
    res.status(501).json({
      message: 'Update user profile endpoint - Coming soon',
      endpoint: 'PUT /api/users/profile'
    });
  };
  
  module.exports = {
    getProfile,
    updateProfile
  };