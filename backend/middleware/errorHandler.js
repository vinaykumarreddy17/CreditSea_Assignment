const errorHandler = (err, req, res, next) => {
    console.error(err.stack);
  
    if (err.name === 'ValidationError') {
      return res.status(400).json({
        success: false,
        error: Object.values(err.errors).map(val => val.message),
      });
    }
  
    const statusCode = err.statusCode || 500;
    const errorMessage = process.env.NODE_ENV === 'production'
      ? 'Server Error'
      : err.message || 'Server Error';
  
    res.status(statusCode).json({
      success: false,
      error: errorMessage,
      stack: process.env.NODE_ENV === 'production' ? undefined : err.stack,
    });
  };
  
  module.exports = errorHandler;