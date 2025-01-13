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
// Get all Users
exports.getAllUsers = async (req, res) => {
    try {
        const users = await User.findAll(); // Sequelize equivalent of finding all users

        res.status(200).json({
            success: true,
            users
        });
    } catch (err) {
        res.status(500).json({
            success: false,
            message: err.message
        });
    }
};

// Get all applications
exports.getAllApp = async (req, res) => {
    try {
        const applications = await Application.findAll({
            include: [
                { model: Job, as: 'job' }, // Sequelize equivalent of population
                { model: User, as: 'applicant' }
            ]
        });

        res.status(200).json({
            success: true,
            applications
        });
    } catch (err) {
        res.status(500).json({
            success: false,
            message: err.message
        });
    }
};
