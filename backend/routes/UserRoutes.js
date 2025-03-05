const express = require("express");
const router = express.Router();
const { register, login, isLogin, me, changePassword, updateProfile, deleteAccount } = require("../controllers/UserControllers");
const upload = require("../config/multerConfig"); // Import Multer configuration
const { isAuthenticated, authorizationRoles } = require("../middlewares/auth"); // Import auth middleware
const { registerValidator, validateHandler, loginValidator, changePasswordValidator, updateProfileValidator, deleteAccountValidator } = require("../middlewares/validators");

// Register route with Multer for file uploads
router.post(
  "/auth/register",
  upload.fields([
    { name: "avatar", maxCount: 1 }, // Handle avatar file
    { name: "resume", maxCount: 1 }, // Handle resume file
  ]),
  registerValidator(),
  validateHandler,
  register
);

// Login route
router.post("/auth/login", loginValidator(), validateHandler, login);

// Check login status
router.get("/auth/status", isLogin);

// Get logged-in user profile (protected route)
router.get("/auth/me", isAuthenticated, me);

// Change password (protected route)
router.put("/auth/password/change", isAuthenticated, changePasswordValidator(), validateHandler, changePassword);

// Update profile (protected route)
router.put(
  "/auth/profile/update",
  isAuthenticated,
  upload.fields([
    { name: "avatar", maxCount: 1 }, // Handle avatar file
    { name: "resume", maxCount: 1 }, // Handle resume file
  ]),
  updateProfileValidator(),
  validateHandler,
  updateProfile
);

// Delete account (protected route)
router.delete("/auth/account/delete", isAuthenticated, deleteAccountValidator(), validateHandler, deleteAccount);

module.exports = router;