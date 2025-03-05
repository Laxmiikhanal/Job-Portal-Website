const express = require("express");
const { isAuthenticated } = require("../middlewares/auth");
const {
    createApplication,
    getSingleApplication,
    getUsersAllApplications,
    deleteApplication
} = require("../controllers/ApplicationControllers");
const { applicationIdValidator, validateHandler } = require("../middlewares/validators");

const router = express.Router();

// Create a new application
router.route("/createApplication/:id").post(
    isAuthenticated,
    applicationIdValidator(),
    validateHandler,
    createApplication
);

// Get a single application
router.route("/singleApplication/:id").get(
    isAuthenticated,
    applicationIdValidator(),
    validateHandler,
    getSingleApplication
);

// Get all applications of a user
router.route("/user/applications").get(isAuthenticated, getUsersAllApplications);

// Delete an application
router.route("/deleteApplication/:id").delete(
    isAuthenticated,
    applicationIdValidator(),
    validateHandler,
    deleteApplication
);

module.exports = router;
