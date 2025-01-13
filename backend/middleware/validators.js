const bcrypt = require('bcrypt');
const { User } = require('../models'); // Import User model
const { createToken } = require('../middlewares/auth');
const cloudinary = require('cloudinary');

// Register
exports.register = async (req, res) => {
  try {
    const { name, email, password, avatar, skills, resume } = req.body;

    // Check if email is already registered
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'Email already in use',
      });
    }

    // Upload avatar to Cloudinary
    const myCloud = await cloudinary.v2.uploader.upload(avatar, {
      folder: 'avatar',
      crop: 'scale',
    });

    // Upload resume to Cloudinary
    const myCloud2 = await cloudinary.v2.uploader.upload(resume, {
      folder: 'resume',
      crop: 'fit',
    });

    // Hash the password
    const hashPass = await bcrypt.hash(password, 10);

    // Create new user
    const user = await User.create({
      name,
      email,
      password: hashPass,
      avatar: {
        public_id: myCloud.public_id,
        url: myCloud.secure_url,
      },
      skills,
      resume: {
        public_id: myCloud2.public_id,
        url: myCloud2.secure_url,
      },
    });

    // Generate token
    const token = createToken(user.id, user.email);

    res.status(201).json({
      success: true,
      message: 'User Created',
      user,
      token,
    });
  } catch (err) {
    console.error(err); // Log the error for debugging
    res.status(500).json({
      success: false,
      message: err.message || 'Internal server error',
    });
  }
};

// Login
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find the user by email
    const user = await User.findOne({ where: { email } });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User does not exist',
      });
    }

    // Compare the password with the hashed password
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Wrong Password',
      });
    }

    // Generate token
    const token = createToken(user.id, user.email);

    res.status(200).json({
      success: true,
      message: 'User logged in successfully',
      token,
    });
  } catch (err) {
    console.error(err); // Log the error for debugging
    res.status(500).json({
      success: false,
      message: err.message || 'Internal server error',
    });
  }
};
