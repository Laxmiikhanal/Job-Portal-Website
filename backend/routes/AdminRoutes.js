const express = require("express");
const {
  getAllJobs,
  getAllUsers,
  getAllApp,
  updateApplication,
  deleteApplication,
  updateUser,
  deleteUser,
  getApplication,
  getUser,
  getJob,
  updateJob,
  deleteJob
} = require('../controllers/AdminController');
const { isAuthenticated, authorizationRoles } = require('../middlewares/auth');
const {
  applicationIdValidator,
  validateHandler,
  userIdValidator,
  JobIdValidator
} = require('../middlewares/validators');
const router = express.Router();

// Get all jobs
router.route("/admin/allJobs").get(isAuthenticated, authorizationRoles("admin"), getAllJobs);
