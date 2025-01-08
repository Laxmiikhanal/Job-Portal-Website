const express = require('express');
const { register, login, isLogin, me, changePassword, updateProfile, deleteAccount } = require('../controllers/UserController');
const { isAuthenticated } = require('../middlewares/auth');
const { registerValidator, validateHandler, loginValidator, changePasswordValidator, updateProfileValidator, deleteAccountValidator } = require('../middlewares/validators');

const router = express.Router();

// Register User
router.route("/register").post(registerValidator(), validateHandler, register);

// Login User
router.route("/login").post(loginValidator(), validateHandler, login);

// Check if User is Logged In
router.route("/isLogin").get(isAuthenticated, isLogin);

// Get Current User Profile
router.route("/me").get(isAuthenticated, me);

// Change User Password
router.route("/changePassword").patch(isAuthenticated, changePasswordValidator(), validateHandler, changePassword);

// Update User Profile
router.route("/updateProfile").patch(isAuthenticated, updateProfileValidator(), validateHandler, updateProfile);

// Delete User Account
router.route("/deleteAccount").delete(isAuthenticated, deleteAccountValidator(), validateHandler, deleteAccount);

module.exports = router;
