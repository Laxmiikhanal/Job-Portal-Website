const jwt = require('jsonwebtoken');
const { User } = require('../models'); // Ensure User is imported from Sequelize

// Function to create a JWT token
exports.createToken = (id, email) => {
  const token = jwt.sign(
    { id, email },
    process.env.SECRET,  // You should have this in your .env file
    { expiresIn: '5d' }  // Expiry time for the token (can be adjusted for your needs)
  );
  return token;
};

// Middleware to check if the user is authenticated
exports.isAuthenticated = async (req, res, next) => {
  try {
    // Get the token from the 'Authorization' header
    const token = req.headers.authorization?.split(' ')[1]; // Format: Bearer <token>
    
    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'Missing Token',
      });
    }

    // Verify the token using the secret key
    const decoded = jwt.verify(token, process.env.SECRET);

    // Find the user by ID (primary key) using Sequelize
    const user = await User.findByPk(decoded.id);  // Using Sequelize `findByPk`

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    // Attach the user object to the request object (for use in next middlewares/controllers)
    req.user = user;

    // Proceed to the next middleware or controller
    next();
  } catch (err) {
    // Handle the error based on error type
    if (err.name === 'JsonWebTokenError') {
      return res.status(401).json({
        success: false,
        message: 'Invalid Token',
      });
    } else if (err.name === 'TokenExpiredError') {
      return res.status(401).json({
        success: false,
        message: 'Token Expired',
      });
    } else {
      console.error(err);  // Log the error for debugging
      return res.status(500).json({
        success: false,
        message: err.message || 'Internal server error',
      });
    }
  }
};
