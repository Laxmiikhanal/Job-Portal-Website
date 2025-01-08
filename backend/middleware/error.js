const { Sequelize } = require('sequelize');

// Middleware for throwing errors
exports.errorMiddleware = (err, req, res, next) => {
  err.message = err.message || 'Internal Server Error';
  err.status = err.status || 500;

  // Handle unique constraint violation (Sequelize)
  if (err.name === 'SequelizeUniqueConstraintError') {
    const error = err.errors.map(e => e.message).join(', ');
    err.message = `Duplicate field(s): ${error}`;
    err.status = 400;
  }

  // Handle validation errors (Sequelize)
  if (err instanceof Sequelize.ValidationError) {
    const error = err.errors.map(e => e.message).join(', ');
    err.message = `Validation error(s): ${error}`;
    err.status = 400;
  }

  // Handle database errors (Sequelize)
  if (err instanceof Sequelize.DatabaseError) {
    err.message = 'Database error occurred';
    err.status = 500;
  }

  // Handle other errors (if necessary)
  if (err.name === 'SequelizeDatabaseError') {
    err.message = 'Invalid format for database input';
    err.status = 400;
  }

  // Return the error response
  return res.status(err.status).json({
    success: false,
    message: err.message,
  });
};
