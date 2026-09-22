const AppError = require('../utils/AppError');
const env = require('../config/env');

/**
 * Map known library errors → AppError with friendly messages.
 */
function normalizeError(err) {
  // Mongoose: invalid ObjectId
  if (err.name === 'CastError') {
    return new AppError('Invalid ID format', 400);
  }

  // Mongoose: schema validation
  if (err.name === 'ValidationError') {
    const messages = Object.values(err.errors)
      .map((e) => e.message)
      .join('. ');
    return new AppError(messages, 400);
  }

  // Mongo: unique index conflict
  if (err.code === 11000) {
    const field = Object.keys(err.keyValue || {})[0] || 'field';
    return new AppError(`${field} already exists`, 409);
  }

  // JWT
  if (err.name === 'JsonWebTokenError') {
    return new AppError('Invalid token', 401);
  }

  if (err.name === 'TokenExpiredError') {
    return new AppError('Token expired, please login again', 401);
  }

  return err;
}

/**
 * Global Express error middleware — mount LAST: app.use(errorHandler)
 */
function errorHandler(err, req, res, next) {
  err = normalizeError(err);

  const statusCode = err.statusCode || 500;
  const status = err.status || (statusCode >= 500 ? 'error' : 'fail');

  // ----- development: full details -----
  if (env.NODE_ENV === 'development') {
    return res.status(statusCode).json({
      success: false,
      status,
      message: err.message,
      stack: err.stack,
      error: err,
    });
  }

  // ----- production -----
  if (err.isOperational) {
    return res.status(statusCode).json({
      success: false,
      status,
      message: err.message,
    });
  }

  // Programming / unknown — never leak internals
  console.error('UNEXPECTED ERROR:', err);
  return res.status(500).json({
    success: false,
    status: 'error',
    message: 'Something went wrong',
  });
}

module.exports = errorHandler;
