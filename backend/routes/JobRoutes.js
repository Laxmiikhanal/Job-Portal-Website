const express = require('express');
const { isAuthenticated, authorizationRoles } = require('../middlewares/auth');
const {
  createJob,
  allJobs,
  oneJob,
  saveJob,
  getSavedJobs,
} = require('../controllers/JobControllers');
const { jobValidator, validateHandler, JobIdValidator } = require('../middlewares/validators');

const router = express.Router();

// Route to create a job (only accessible by admins)
router.route('/create/job').post(isAuthenticated, authorizationRoles('admin'), jobValidator(), validateHandler, createJob);

// Route to get all jobs
router.route('/jobs').get(allJobs);

// Route to get a single job by ID
router.route('/job/:id').get(JobIdValidator(), validateHandler, oneJob);

// Route to save or unsave a job
router.route('/saveJob/:id').get(isAuthenticated, JobIdValidator(), validateHandler, saveJob);

// Route to get all saved jobs for the authenticated user
router.route('/getSavedJobs').get(isAuthenticated, getSavedJobs);

module.exports = router;
