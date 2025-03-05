const express = require("express");
const router = express.Router();
const { createJob, allJobs, oneJob, saveJob, getSavedJobs } = require("../controllers/JobControllers");
const upload = require("../config/multerConfig"); // Import Multer configuration
const { jobValidator, validateHandler, JobIdValidator } = require("../middlewares/validators");
const { isAuthenticated, authorizationRoles } = require("../middlewares/auth");

// Create a new job (Admin only)
// Create a new job (Admin only)
router.post(
    "/job/create",
    isAuthenticated,
    authorizationRoles("admin"),
    upload.single("logo"), // Handle logo file upload
    jobValidator(),
    validateHandler,
    createJob
  );

// Get all jobs
router.get("/jobs", allJobs);

// Get a single job by ID
router.get("/job/:id", JobIdValidator(), validateHandler, oneJob);

// Save or unsave a job
router.post("/job/save/:id", isAuthenticated, JobIdValidator(), validateHandler, saveJob);

// Get all saved jobs for the logged-in user
router.get("/user/saved-jobs", isAuthenticated, getSavedJobs);

module.exports = router;