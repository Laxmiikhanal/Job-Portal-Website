const jwt = require('jsonwebtoken');
const { User } = require('../models'); // Make sure to import User from Sequelize

// Function to create token
exports.createToken = (id, email) => {
  const token = jwt.sign(
    { id, email },
    process.env.SECRET,
    { expiresIn: '5d' } // Consider changing the expiration time for enhanced security if needed
  );
  return token;
};

// Middleware to check if the user is authenticated
exports.isAuthenticated = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(' ')[1]; // Get the token from Authorization header
    
    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'Missing Token',
      });
    }

    const decoded = jwt.verify(token, process.env.SECRET);

    // Use Sequelize to find user by ID
    const user = await User.findByPk(decoded.id);  // Replaced `findById` with `findByPk`

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    req.user = user; // Attach user to the request object
    next(); // Proceed to the next middleware
  } catch (err) {
    console.error(err); // Log the error for debugging
    res.status(500).json({
      success: false,
      message: err.message || 'Internal server error',
    });
  }
};
