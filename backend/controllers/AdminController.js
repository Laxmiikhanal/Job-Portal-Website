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
// Update Application Status
exports.updateApplication = async (req, res) => {
    try {
        const application = await Application.findByPk(req.params.id); // Sequelize equivalent of find by ID

        if (!application) {
            return res.status(404).json({
                success: false,
                message: 'Application not found'
            });
        }

        application.status = req.body.status; // Update status
        await application.save(); // Save changes

        res.status(200).json({
            success: true,
            message: 'Application Updated'
        });
    } catch (err) {
        res.status(500).json({
            success: false,
            message: err.message
        });
    }
};
// Delete Application
exports.deleteApplication = async (req, res) => {
    try {
        const application = await Application.findByPk(req.params.id); // Sequelize equivalent of find by ID

        if (!application) {
            return res.status(404).json({
                success: false,
                message: 'Application not found'
            });
        }

        await application.destroy(); // Delete application

        res.status(200).json({
            success: true,
            message: 'Application Deleted'
        });
    } catch (err) {
        res.status(500).json({
            success: false,
            message: err.message
        });
    }
};
// Get Application
exports.getApplication = async (req, res) => {
    try {
        const application = await Application.findByPk(req.params.id, {
            include: [
                { model: Job, as: 'job' }, // Populate job
                { model: User, as: 'applicant' } // Populate applicant
            ]
        });

        if (!application) {
            return res.status(404).json({
                success: false,
                message: 'Application not found'
            });
        }

        res.status(200).json({
            success: true,
            application
        });
    } catch (err) {
        res.status(500).json({
            success: false,
            message: err.message
        });
    }
};

// Update User Role
exports.updateUser = async (req, res) => {
    try {
        const user = await User.findByPk(req.params.id); // Sequelize equivalent of find by ID

        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }

        user.role = req.body.role; // Update role
        await user.save(); // Save changes

        res.status(200).json({
            success: true,
            message: 'User Updated'
        });
    } catch (err) {
        res.status(500).json({
            success: false,
            message: err.message
        });
    }
};

// Delete User
exports.deleteUser = async (req, res) => {
    try {
        const user = await User.findByPk(req.params.id); // Sequelize equivalent of find by ID

        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }

        await user.destroy(); // Delete user

        res.status(200).json({
            success: true,
            message: 'User Deleted'
        });
    } catch (err) {
        res.status(500).json({
            success: false,
            message: err.message
        });
    }
};

// Get User
exports.getUser = async (req, res) => {
    try {
        const user = await User.findByPk(req.params.id); // Sequelize equivalent of find by ID

        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }

        res.status(200).json({
            success: true,
            user
        });
    } catch (err) {
        res.status(500).json({
            success: false,
            message: err.message
        });
    }
};
