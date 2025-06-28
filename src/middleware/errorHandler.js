const errorHandler = (err, req, res, next) => {
    console.error(err.stack);
  
    // Default error
    let error = {
      message: err.message || 'Internal Server Error',
      status: err.status || 500
    };
  
    // Mongoose validation error
    if (err.name === 'ValidationError') {
      error.message = Object.values(err.errors).map(val => val.message).join(', ');
      error.status = 400;
    }
  
    // Prisma errors
    if (err.code === 'P2002') {
      error.message = 'Resource already exists';
      error.status = 409;
    }
  
    // JWT errors
    if (err.name === 'JsonWebTokenError') {
      error.message = 'Invalid token';
      error.status = 401;
    }
  
    res.status(error.status).json({
      error: error.message,
      ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
    });
  };
  
  module.exports = errorHandler;