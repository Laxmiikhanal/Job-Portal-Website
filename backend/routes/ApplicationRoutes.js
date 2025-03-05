const express = require('express');
const { isAuthenticated } = require('../middlewares/auth');
const { createApplication, getSingleApplication, getUsersAllApplications, deleteApplication } = require('../controllers/ApplicationControllers');
const { applicationIdValidator, validateHandler } = require('../middlewares/validators');

const router = express.Router();

// Create a new application
router.route('/createApplication/:id')
    .post(
        isAuthenticated, // Authentication middleware to check if the user is logged in
        applicationIdValidator(), // Validation for the job ID
        validateHandler, // Handles validation errors
        createApplication // Controller function to create the application
    );

// Get a single application by ID
router.route('/singleApplication/:id')
    .get(
        isAuthenticated, // Authentication middleware
        applicationIdValidator(), // Validate the application ID
        validateHandler, // Validation error handler
        getSingleApplication // Controller function to get the single application
    );

// Get all applications for the authenticated user
router.route('/applications') // Changed to /applications for RESTful naming
    .get(
        isAuthenticated, // Authentication middleware
        getUsersAllApplications // Controller function to get all applications for the user
    );

// Delete a specific application
router.route('/deleteApplication/:id')
    .delete(
        isAuthenticated, // Authentication middleware
        applicationIdValidator(), // Validate the application ID
        validateHandler, // Validation error handler
        deleteApplication // Controller function to delete an application
    );

module.exports = router;
