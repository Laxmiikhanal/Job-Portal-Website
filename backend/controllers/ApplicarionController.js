const { Job, User, Application } = require('../models');

// Creates a new application
exports.createApplication = async (req, res) => {
    try {
        const job = await Job.findByPk(req.params.id); // Using findByPk instead of findById
        const user = await User.findByPk(req.user._id); // Using findByPk instead of findById

        if (!job || !user) {
            return res.status(404).json({
                success: false,
                message: "Job or User not found"
            });
        }

        // Check if the user has already applied for the job
        const existingApplication = await Application.findOne({
            where: {
                jobId: job.id,
                userId: user.id
            }
        });

        if (existingApplication) {
            return res.status(400).json({
                success: false,
                message: "You have already applied for this job."
            });
        }

        // Create a new application
        const application = await Application.create({
            jobId: job.id,
            userId: user.id,
            applicantResume: {
                public_id: user.resume ? user.resume.public_id : null,
                url: user.resume ? user.resume.url : null
            }
        });

        // Optionally, track applied jobs in the user model
        // This part depends on your user model setup (i.e., `appliedJobs` field)
        user.appliedJobs = user.appliedJobs || [];
        user.appliedJobs.push(job.id);
        await user.save();

        res.status(200).json({
            success: true,
            message: "Application created successfully",
            application
        });

    } catch (err) {
        res.status(500).json({
            success: false,
            message: err.message
        });
    }
};

// Get a single application
exports.getSingleApplication = async (req, res) => {
    try {
        const application = await Application.findByPk(req.params.id, {
            include: [
                { model: Job, as: 'job' }, 
                { model: User, as: 'applicant' }
            ]
        });

        if (!application) {
            return res.status(404).json({
                success: false,
                message: "Application not found"
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

// Get all applications for a specific user
exports.getUsersAllApplications = async (req, res) => {
    try {
        const applications = await Application.findAll({
            where: { userId: req.user._id },
            include: [
                { model: Job, as: 'job' },
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

// Delete an application
exports.deleteApplication = async (req, res) => {
    try {
        const application = await Application.findByPk(req.params.id);

        if (!application) {
            return res.status(404).json({
                success: false,
                message: "Application not found"
            });
        }

        const jobId = application.jobId;
        const userId = application.userId;

        // Delete the application
        await application.destroy();

        // Remove the job from the user's applied jobs if applicable
        const user = await User.findByPk(userId);
        if (user) {
            user.appliedJobs = user.appliedJobs.filter(jobId => jobId !== application.jobId);
            await user.save();
        }

        res.status(200).json({
            success: true,
            message: "Application deleted successfully"
        });

    } catch (err) {
        res.status(500).json({
            success: false,
            message: err.message
        });
    }
};
