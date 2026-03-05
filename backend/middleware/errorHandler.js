// Global error handler middleware
const errorHandler = (err, req, res, next) => {
  console.error(`[ERROR] ${req.method} ${req.path}:`, err.message);

  // MySQL duplicate entry
  if (err.code === 'ER_DUP_ENTRY') {
    return res.status(409).json({
      success: false,
      message: 'A record with this information already exists.',
    });
  }

  // MySQL foreign key constraint
  if (err.code === 'ER_NO_REFERENCED_ROW_2') {
    return res.status(400).json({
      success: false,
      message: 'Referenced resource does not exist.',
    });
  }

  // JWT errors
  if (err.name === 'JsonWebTokenError') {
    return res.status(401).json({
      success: false,
      message: 'Invalid token.',
    });
  }

  // Default server error
  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Internal server error.',
  });
};

module.exports = { errorHandler };