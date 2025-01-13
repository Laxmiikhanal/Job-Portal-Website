const { Job, User, SavedJob } = require('../models'); // Import models
const cloudinary = require('cloudinary').v2; // Cloudinary for file uploads

exports.createJob = async (req, res) => {
  try {
    const {
      title,
      description,
      companyName,
      location,
      logo,
      skillsRequired,
      experience,
      salary,
      category,
      employmentType,
    } = req.body;

    // Upload the company logo to Cloudinary
    const myCloud = await cloudinary.uploader.upload(logo, {
      folder: 'logo',
      crop: 'scale',
    });

    // Create the new job record
    const newJob = await Job.create({
      title,
      description,
      companyName,
      companyLogo: {
        public_id: myCloud.public_id,
        url: myCloud.secure_url,
      },
      location,
      skillsRequired,
      experience,
      category,
      salary,
      employmentType,
      postedBy: req.user.id, // Assuming req.user.id contains the authenticated user's ID
    });

    res.status(200).json({
      success: true,
      message: 'Job created successfully',
      newJob,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

exports.allJobs = async (req, res) => {
  try {
    // Fetch all jobs
    const jobs = await Job.findAll();

    res.status(200).json({
      success: true,
      jobs,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

exports.oneJob = async (req, res) => {
  try {
    // Fetch job by ID and include the associated user (postedBy)
    const job = await Job.findByPk(req.params.id, {
      include: [{ model: User, as: 'postedBy', attributes: ['id', 'name', 'email'] }],
    });

    if (!job) {
      return res.status(404).json({
        success: false,
        message: 'Job not found',
      });
    }

    res.status(200).json({
      success: true,
      job,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

exports.saveJob = async (req, res) => {
  try {
    const { id: jobId } = req.params; // Job ID from URL params
    const userId = req.user.id; // Authenticated user's ID

    // Check if the job is already saved
    const existingSave = await SavedJob.findOne({ where: { userId, jobId } });

    if (existingSave) {
      // If already saved, remove it
      await SavedJob.destroy({ where: { userId, jobId } });
      return res.status(200).json({
        success: true,
        message: 'Job unsaved',
      });
    }

    // Save the job
    await SavedJob.create({ userId, jobId });
    res.status(200).json({
      success: true,
      message: 'Job saved',
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

exports.getSavedJobs = async (req, res) => {
  try {
    const userId = req.user.id; // Authenticated user's ID

    // Fetch saved jobs for the user
    const savedJobs = await SavedJob.findAll({
      where: { userId },
      include: [{ model: Job, as: 'jobDetails' }],
    });

    res.status(200).json({
      success: true,
      savedJobs,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};
