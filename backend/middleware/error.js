const { Sequelize } = require('sequelize');

// Middleware for throwing errors
exports.errorMiddleware = (err, req, res, next) => {
  // Set default error message and status
  err.message = err.message || 'Internal Server Error';
  err.status = err.status || 500;

  // Log error details for debugging purposes (useful for debugging in development mode)
  console.error(err);

  // Handle unique constraint violation (Sequelize)
  if (err.name === 'SequelizeUniqueConstraintError') {
    const errorFields = err.errors.map(e => e.path).join(', '); // Grab the field(s) causing the issue
    const errorMessage = err.errors.map(e => e.message).join(', ');
    err.message = `Duplicate value(s) for field(s): ${errorFields}. ${errorMessage}`;
    err.status = 400;
  }

  // Handle validation errors (Sequelize)
  if (err instanceof Sequelize.ValidationError) {
    const errorMessages = err.errors.map(e => e.message).join(', ');
    err.message = `Validation error(s): ${errorMessages}`;
    err.status = 400;
  }

  // Handle database errors (Sequelize)
  if (err instanceof Sequelize.DatabaseError) {
    err.message = 'Database error occurred';
    err.status = 500;
  }

  // Handle foreign key constraint violation (Sequelize)
  if (err instanceof Sequelize.ForeignKeyConstraintError) {
    err.message = 'Foreign key constraint violation';
    err.status = 400;
  }

  // Handle connection errors (Sequelize)
  if (err instanceof Sequelize.ConnectionError) {
    err.message = 'Database connection error';
    err.status = 503;  // Service Unavailable
  }

  // Handle other errors (if necessary)
  if (err.name === 'SequelizeDatabaseError') {
    err.message = 'Invalid format for database input';
    err.status = 400;
  }

  // Final response with the error message
  return res.status(err.status).json({
    success: false,
    message: err.message,
  });
};
