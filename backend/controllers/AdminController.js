const { Job, User, Application } = require('../models'); // Adjust the model imports according to Sequelize
const cloudinary = require('cloudinary');

// Get all jobs
exports.getAllJobs = async (req, res) => {
    try {
        const jobs = await Job.findAll(); // Sequelize equivalent of finding all jobs

        res.status(200).json({
            success: true,
            jobs
        });
    } catch (err) {
        res.status(500).json({
            success: false,
            message: err.message
        });
    }
};
