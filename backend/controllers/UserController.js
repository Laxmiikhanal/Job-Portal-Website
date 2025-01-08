const bcrypt = require('bcrypt');
const { user } = require('../models'); // Import User model
const { createToken } = require('../middlewares/auth');
const cloudinary = require('cloudinary');

// Register
exports.register = async (req, res) => {
  try {
    const { name, email, password, avatar, skills, resume } = req.body;

    const myCloud = await cloudinary.v2.uploader.upload(avatar, {
      folder: 'avatar',
      crop: 'scale',
    });

    const myCloud2 = await cloudinary.v2.uploader.upload(resume, {
      folder: 'resume',
      crop: 'fit',
    });

    const hashPass = await bcrypt.hash(password, 10);

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

    const token = createToken(user.id, user.email); // Use `user.id` instead of `user._id`

    res.status(201).json({
      success: true,
      message: 'User Created',
      user,
      token,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

// Login
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ where: { email } }); // Using Sequelize's `findOne` method

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User does not exist',
      });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Wrong Password',
      });
    }

    const token = createToken(user.id, user.email); // Use `user.id` instead of `user._id`

    res.status(200).json({
      success: true,
      message: 'User logged in successfully',
      token,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};
