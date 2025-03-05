const cloudinary = require('cloudinary').v2;

// Cloudinary configuration with your credentials
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME, // from your Cloudinary dashboard
  api_key: process.env.CLOUDINARY_API_KEY,       // from your Cloudinary dashboard
  api_secret: process.env.CLOUDINARY_API_SECRET  // from your Cloudinary dashboard
});

module.exports = cloudinary;
