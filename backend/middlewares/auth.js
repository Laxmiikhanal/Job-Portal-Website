const jwt = require("jsonwebtoken");
const pool = require("../config/database");

// ✅ Generate JWT token
exports.createToken = (id, email) => {
  if (!process.env.JWT_SECRET) {
    throw new Error("JWT_SECRET is missing in environment variables");
  }
  return jwt.sign({ id, email }, process.env.JWT_SECRET, { expiresIn: "5d" });
};

// ✅ Authentication Middleware
exports.isAuthenticated = async (req, res, next) => {
  try {
    // Get the token from the Authorization header
    const token = req.headers.authorization?.split(" ")[1];

    if (!token) {
      return res.status(401).json({
        success: false,
        isLogin: false,
        message: "Missing Token. Please log in.",
      });
    }

    // Verify the token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Fetch user from PostgreSQL
    const user = await pool.query("SELECT * FROM users WHERE id = $1;", [decoded.id]);

    if (user.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "User not found. Please log in again.",
      });
    }

    // Attach the user to the request object
    req.user = user.rows[0];
    next();
  } catch (err) {
    console.error("Authentication error:", err); // Debugging: Log the error

    if (err.name === "TokenExpiredError") {
      return res.status(401).json({
        success: false,
        isLogin: false,
        message: "Token expired. Please log in again.",
      });
    }

    if (err.name === "JsonWebTokenError") {
      return res.status(401).json({
        success: false,
        isLogin: false,
        message: "Invalid token. Please log in again.",
      });
    }

    res.status(500).json({
      success: false,
      isLogin: false,
      message: "Authentication failed. Please try again.",
    });
  }
};

// ✅ Role Authorization Middleware
exports.authorizationRoles = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: "User not authenticated. Please log in.",
      });
    }

    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: `Access denied. Required roles: ${roles.join(", ")}.`,
      });
    }

    next();
  };
};