const AppError = require('../utils/AppError');

/**
 * Zod validation middleware factory.
 * Usage: validate(schema) or validate(schema, 'query')
 */
function validate(schema, source = 'body') {
  return (req, res, next) => {
    const result = schema.safeParse(req[source]);

    if (!result.success) {
      const message = result.error.issues
        .map((issue) => issue.message)
        .join('. ');
      return next(new AppError(message, 400));
    }

    req[source] = result.data;
    next();
  };
}

module.exports = validate;
