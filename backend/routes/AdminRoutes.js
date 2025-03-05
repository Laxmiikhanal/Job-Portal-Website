const express = require("express");
const {
    getAllJobs,
    getAllUsers,
    getAllApplications,  // ✅ Fixed function name
    updateApplication,
    deleteApplication,
    updateUser,
    deleteUser,
    getApplication,
    getUser,
    getJob,
    updateJob,
    deleteJob
} = require("../controllers/AdminControllers");
const { isAuthenticated, authorizationRoles } = require("../middlewares/auth");
const { applicationIdValidator, validateHandler, userIdValidator, JobIdValidator } = require("../middlewares/validators");

const router = express.Router();

// Jobs Routes
router.route("/admin/allJobs").get(isAuthenticated, authorizationRoles("admin"), getAllJobs);
router.route("/admin/getJob/:id").get(isAuthenticated, authorizationRoles("admin"), JobIdValidator(), validateHandler, getJob);
router.route("/admin/updateJob/:id").put(isAuthenticated, authorizationRoles("admin"), JobIdValidator(), validateHandler, updateJob);
router.route("/admin/deleteJob/:id").delete(isAuthenticated, authorizationRoles("admin"), JobIdValidator(), validateHandler, deleteJob);

// Users Routes
router.route("/admin/allUsers").get(isAuthenticated, authorizationRoles("admin"), getAllUsers);
router.route("/admin/getUser/:id").get(isAuthenticated, authorizationRoles("admin"), userIdValidator(), validateHandler, getUser);
router.route("/admin/updateUser/:id").put(isAuthenticated, authorizationRoles("admin"), userIdValidator(), validateHandler, updateUser);
router.route("/admin/deleteUser/:id").delete(isAuthenticated, authorizationRoles("admin"), userIdValidator(), validateHandler, deleteUser);

// Applications Routes
router.route("/admin/allApplications").get(isAuthenticated, authorizationRoles("admin"), getAllApplications); // ✅ Fixed route
router.route("/admin/getApplication/:id").get(isAuthenticated, authorizationRoles("admin"), applicationIdValidator(), validateHandler, getApplication);
router.route("/admin/updateApplication/:id").put(isAuthenticated, authorizationRoles("admin"), applicationIdValidator(), validateHandler, updateApplication);
router.route("/admin/deleteApplication/:id").delete(isAuthenticated, authorizationRoles("admin"), applicationIdValidator(), validateHandler, deleteApplication);

module.exports = router;
