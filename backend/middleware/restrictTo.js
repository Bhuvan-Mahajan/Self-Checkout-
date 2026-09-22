const AppError = require('../utils/AppError');

/**
 * Role gate — use AFTER protect.
 * Example: router.get('/admin', protect, restrictTo('admin', 'staff'), handler)
 */
function restrictTo(...roles) {
  return (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return next(new AppError('Not authorized for this action', 403));
    }
    next();
  };
}

module.exports = restrictTo;
