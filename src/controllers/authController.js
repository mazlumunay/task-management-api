const register = async (req, res) => {
    res.status(501).json({
      message: 'Register endpoint - Coming soon',
      endpoint: 'POST /api/auth/register'
    });
  };
  
  const login = async (req, res) => {
    res.status(501).json({
      message: 'Login endpoint - Coming soon',
      endpoint: 'POST /api/auth/login'
    });
  };
  
  const logout = async (req, res) => {
    res.status(501).json({
      message: 'Logout endpoint - Coming soon',
      endpoint: 'POST /api/auth/logout'
    });
  };
  
  module.exports = {
    register,
    login,
    logout
  };