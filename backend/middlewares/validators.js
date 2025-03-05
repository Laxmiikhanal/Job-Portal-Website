const { body, validationResult, param } = require("express-validator");

// Handle validation errors
exports.validateHandler = (req, res, next) => {
  const errors = validationResult(req);
  if (errors.isEmpty()) return next();

  const errorMessages = errors.array().map((error) => error.msg).join(", ");
  return res.status(400).json({ success: false, message: errorMessages });
};

// Register validation
exports.registerValidator = () => [
  body("name").notEmpty().withMessage("Please enter name"),
  body("email").isEmail().withMessage("Please enter a valid email"),
  body("password").notEmpty().withMessage("Please enter password"),
  body("skills").notEmpty().withMessage("Please enter skills"),
];

// Login validation
exports.loginValidator = () => [
  body("email").isEmail().withMessage("Please enter a valid email"),
  body("password").notEmpty().withMessage("Please enter password"),
];

// Change password validation
exports.changePasswordValidator = () => [
  body("oldPassword").notEmpty().withMessage("Please enter your old password"),
  body("newPassword").notEmpty().withMessage("Please enter a new password"),
  body("confirmPassword").notEmpty().withMessage("Please confirm your new password"),
];

// Update profile validation
exports.updateProfileValidator = () => [
  body("newName").optional().notEmpty().withMessage("Name cannot be empty"),
  body("newEmail").optional().isEmail().withMessage("Please enter a valid email"),
  body("newSkills").optional().notEmpty().withMessage("Skills cannot be empty"),
];

// Delete account validation
exports.deleteAccountValidator = () => [
  body("password").notEmpty().withMessage("Please enter your password to delete your account"),
];

// Job validation
exports.jobValidator = () => [
  body("title").notEmpty().withMessage("Please enter title"),
  body("description").notEmpty().withMessage("Please enter description"),
  body("companyName").notEmpty().withMessage("Please enter company name"),
  body("location").notEmpty().withMessage("Please enter location"),
  body("skillsRequired").notEmpty().withMessage("Please enter skills required"),
  body("experience").notEmpty().withMessage("Please enter experience"),
  body("salary").notEmpty().withMessage("Please enter salary"),
  body("category").notEmpty().withMessage("Please enter category"),
  body("employmentType").notEmpty().withMessage("Please enter employment type"),
];

// Job ID validation
exports.JobIdValidator = () => [
  param("id", "Please provide a valid Job ID").notEmpty(),
];

// Application ID validation
exports.applicationIdValidator = () => [
  param("id", "Please provide a valid Application ID").notEmpty(),
];

// User ID validation
exports.userIdValidator = () => [
  param("id", "Please provide a valid User ID").notEmpty(),
];