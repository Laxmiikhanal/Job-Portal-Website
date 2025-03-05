// Middleware for handling errors
exports.errorMiddleware = (err, req, res, next) => {
  err.message = err.message || "Internal Server Error";
  err.status = err.status || 500;

  // Handle PostgreSQL unique constraint errors (Duplicate Entry)
  if (err.code === "23505") {
      err.message = `Duplicate field - ${err.detail}`;
      err.status = 400;
  }

  // Handle invalid data type errors
  if (err.code === "22P02") {
      err.message = "Invalid input format";
      err.status = 400;
  }

  return res.status(err.status).json({ success: false, message: err.message });
};
