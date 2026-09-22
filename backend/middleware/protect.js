const jwt = require('jsonwebtoken');
const { User } = require('../models');
const env = require('../config/env');
const AppError = require('../utils/AppError');
const asyncHandler = require('../utils/asyncHandler');

/**
 * Protect routes — requires valid Bearer access token.
 * Sets req.user on success.
 */
const protect = asyncHandler(async (req, res, next) => {
  const header = req.headers.authorization;

  if (!header || !header.startsWith('Bearer ')) {
    throw new AppError('Not authenticated', 401);
  }

  const token = header.split(' ')[1];

  // Throws JsonWebTokenError / TokenExpiredError → errorHandler
  const decoded = jwt.verify(token, env.JWT_SECRET);

  const user = await User.findById(decoded.id);
  if (!user) {
    throw new AppError('User no longer exists', 401);
  }

  if (!user.isActive) {
    throw new AppError('Account deactivated', 401);
  }

  req.user = user;
  next();
});

module.exports = protect;
