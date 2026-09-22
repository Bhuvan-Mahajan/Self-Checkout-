/**
 * middleware/notFound.js — 404 handler for unknown routes
 * ------------------------------------------------
 * WHY THIS FILE EXISTS SEPARATELY:
 *   Express has no built-in JSON 404 for unmatched /api paths.
 *   A tiny dedicated middleware keeps app.js readable and ensures
 *   every miss goes through the same error shape as other failures.
 *
 * WHAT GOES HERE:
 *   - (req, res, next) => next(new AppError(`Cannot ${req.method} ${req.originalUrl}`, 404))
 *   - Mounted AFTER all real routes
 *
 * WHAT DOES NOT GO HERE:
 *   - Generic try/catch formatting → errorHandler.js
 */

// // const AppError = require('../utils/AppError');

// // function notFound(req, res, next) {
// //   // next(new AppError(`Cannot ${req.method} ${req.originalUrl}`, 404));
// // }

// // module.exports = notFound;
