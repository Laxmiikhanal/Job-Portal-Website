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
// Get all users
router.route("/admin/allUsers").get(isAuthenticated, authorizationRoles("admin"), getAllUsers);
// Get all applications
router.route("/admin/allApp").get(isAuthenticated, authorizationRoles("admin"), getAllApp);
// Get a specific application by ID
router.route("/admin/getApplication/:id")
  .get(isAuthenticated, authorizationRoles("admin"), applicationIdValidator(), validateHandler, getApplication);
// Update application status
router.route("/admin/updateApplication/:id")
  .put(isAuthenticated, authorizationRoles("admin"), applicationIdValidator(), validateHandler, updateApplication);
// Delete an application
router.route("/admin/deleteApplication/:id")
  .delete(isAuthenticated, authorizationRoles("admin"), applicationIdValidator(), validateHandler, deleteApplication);
