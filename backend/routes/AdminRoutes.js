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
} = require('../controllers/AdminControllers');
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

// Get a user by ID
router.route("/admin/getUser/:id")
  .get(isAuthenticated, authorizationRoles("admin"), userIdValidator(), validateHandler, getUser);

// Update user details
router.route("/admin/updateUser/:id")
  .put(isAuthenticated, authorizationRoles("admin"), userIdValidator(), validateHandler, updateUser);

// Delete a user
router.route("/admin/deleteUser/:id")
  .delete(isAuthenticated, authorizationRoles("admin"), userIdValidator(), validateHandler, deleteUser);

// Get a job by ID
router.route("/admin/getJob/:id")
  .get(isAuthenticated, authorizationRoles("admin"), JobIdValidator(), validateHandler, getJob);

// Update a job
router.route("/admin/updateJob/:id")
  .put(isAuthenticated, authorizationRoles("admin"), JobIdValidator(), validateHandler, updateJob);

// Delete a job
router.route("/admin/deleteJob/:id")
  .delete(isAuthenticated, authorizationRoles("admin"), JobIdValidator(), validateHandler, deleteJob);

module.exports = router;
