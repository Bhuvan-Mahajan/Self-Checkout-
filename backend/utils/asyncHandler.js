/**
 * Wraps async route handlers so rejected promises / thrown errors
 * reach the global errorHandler via next(err).
 */
function asyncHandler(fn) {
  return (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
}

module.exports = asyncHandler;
