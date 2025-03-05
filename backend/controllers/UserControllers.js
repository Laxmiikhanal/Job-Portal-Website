const pool = require("../config/database");
const bcrypt = require("bcrypt");
const { createToken } = require("../middlewares/auth");
const fs = require("fs");
const path = require("path");

// Register a new user
exports.register = async (req, res) => {
    try {
      const { name, email, password, skills, role } = req.body;
  
      console.log("Received registration request:", {
        name,
        email,
        skills,
        role,
      });
  
      // Debugging: Log the files received
      console.log("Files received:", req.files);
  
      // Validate required fields
      if (!name || !email || !password || !skills) {
        return res.status(400).json({
          success: false,
          message: "Please provide all required fields: name, email, password, skills",
        });
      }
  
      // Validate file uploads
      if (!req.files || !req.files.avatar || !req.files.resume) {
        return res.status(400).json({
          success: false,
          message: "Please upload both an avatar and a resume",
        });
      }
  
      // Get file paths
      const avatarPath = req.files.avatar[0].path; // Path to the uploaded avatar
      const resumePath = req.files.resume[0].path; // Path to the uploaded resume
  
      // Validate and set role
      const allowedRoles = ["applicant", "admin"]; // Define allowed roles
      const userRole = allowedRoles.includes(role) ? role : "applicant"; // Default to 'applicant' if role is invalid or not provided
  
      // Format skills correctly
      const formattedSkills = Array.isArray(skills)
        ? `{${skills.join(",")}}`
        : `{${skills}}`;
  
      // Hash password
      console.log("Hashing password...");
      const hashPass = await bcrypt.hash(password, 10);
  
      // Insert user into PostgreSQL
      console.log("Inserting user into database...");
      const user = await pool.query(
        `INSERT INTO users (name, email, password, avatar_url, skills, resume_url, role) 
         VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *;`,
        [name, email, hashPass, avatarPath, formattedSkills, resumePath, userRole]
      );
      console.log("User inserted:", user.rows[0]);
  
      // Generate token
      const token = createToken(user.rows[0].id, user.rows[0].email);
  
      res.status(201).json({
        success: true,
        message: "User Created",
        user: user.rows[0],
        token,
      });
    } catch (err) {
      console.error("Registration error:", err);
  
      // Delete uploaded files if an error occurs
      if (req.files && req.files.avatar) {
        fs.unlinkSync(req.files.avatar[0].path);
      }
      if (req.files && req.files.resume) {
        fs.unlinkSync(req.files.resume[0].path);
      }
  
      res.status(500).json({ success: false, message: err.message });
    }
  };
// User login
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find user by email
    const user = await pool.query("SELECT * FROM users WHERE email = $1;", [
      email,
    ]);

    if (user.rows.length === 0) {
      return res
        .status(404)
        .json({ success: false, message: "User does not exist" });
    }

    // Compare passwords
    const isMatch = await bcrypt.compare(password, user.rows[0].password);

    if (!isMatch) {
      return res
        .status(401)
        .json({ success: false, message: "Wrong password" });
    }

    // Generate token
    const token = createToken(user.rows[0].id, user.rows[0].email);

    res
      .status(200)
      .json({ success: true, message: "User logged in successfully", token });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// Check if user is logged in
exports.isLogin = async (req, res) => {
  try {
    const user = await pool.query("SELECT id FROM users WHERE id = $1;", [
      req.user.id,
    ]);

    res.status(200).json({ success: true, isLogin: user.rows.length > 0 });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// Get logged-in user profile
exports.me = async (req, res) => {
    try {
      console.log("Request user:", req.user); // Debugging: Log req.user
  
      if (!req.user || !req.user.id) {
        return res.status(401).json({ success: false, message: "User not authenticated" });
      }
  
      const user = await pool.query("SELECT * FROM users WHERE id = $1;", [
        req.user.id,
      ]);
  
      if (user.rows.length === 0) {
        return res.status(404).json({ success: false, message: "User not found" });
      }
  
      res.status(200).json({ success: true, user: user.rows[0] });
    } catch (err) {
      console.error("Error in /auth/me:", err); // Debugging: Log the error
      res.status(500).json({ success: false, message: err.message });
    }
  };

// Change user password
exports.changePassword = async (req, res) => {
  try {
    const { oldPassword, newPassword, confirmPassword } = req.body;
    const user = await pool.query("SELECT password FROM users WHERE id = $1;", [
      req.user.id,
    ]);

    // Check old password
    const isMatch = await bcrypt.compare(oldPassword, user.rows[0].password);
    if (!isMatch)
      return res
        .status(401)
        .json({ success: false, message: "Old password is wrong" });

    // Check if new password matches confirm password
    if (newPassword !== confirmPassword) {
      return res
        .status(400)
        .json({
          success: false,
          message: "New password and confirm password do not match",
        });
    }

    // Hash new password
    const hashPass = await bcrypt.hash(newPassword, 10);
    await pool.query("UPDATE users SET password = $1 WHERE id = $2;", [
      hashPass,
      req.user.id,
    ]);

    res
      .status(200)
      .json({ success: true, message: "Password changed successfully" });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// Update user profile
exports.updateProfile = async (req, res) => {
    try {
      const { newName, newEmail, newSkills } = req.body;
  
      const user = await pool.query("SELECT * FROM users WHERE id = $1;", [
        req.user.id,
      ]);
      if (user.rows.length === 0) {
        return res
          .status(404)
          .json({ success: false, message: "User not found" });
      }
  
      let avatarUrl = user.rows[0].avatar_url;
      let resumeUrl = user.rows[0].resume_url;
      let updatedFields = [];
  
      // ✅ Only update fields that are provided in request
      if (newName) {
        updatedFields.push({ column: "name", value: newName });
      }
  
      if (newEmail) {
        updatedFields.push({ column: "email", value: newEmail });
      }
  
      if (newSkills) {
        updatedFields.push({
          column: "skills",
          value: `{${newSkills.split(",").join(",")}}`,
        });
      }
  
      // Handle avatar file upload
      if (req.files && req.files.avatar) {
        // Delete old avatar file if it exists
        if (avatarUrl) {
          fs.unlinkSync(path.join(__dirname, "..", avatarUrl));
        }
        avatarUrl = `/uploads/${req.files.avatar[0].filename}`;
        updatedFields.push({ column: "avatar_url", value: avatarUrl });
      }
  
      // Handle resume file upload
      if (req.files && req.files.resume) {
        // Delete old resume file if it exists
        if (resumeUrl) {
          fs.unlinkSync(path.join(__dirname, "..", resumeUrl));
        }
        resumeUrl = `/uploads/${req.files.resume[0].filename}`;
        updatedFields.push({ column: "resume_url", value: resumeUrl });
      }
  
      // ✅ Update only the provided fields
      if (updatedFields.length > 0) {
        let query = `UPDATE users SET `;
        const values = [];
        updatedFields.forEach((field, index) => {
          query += `${field.column} = $${index + 1}, `;
          values.push(field.value);
        });
        query = query.slice(0, -2); // Remove last comma
        query += ` WHERE id = $${values.length + 1};`;
        values.push(req.user.id);
  
        await pool.query(query, values);
      }
  
      res.status(200).json({ success: true, message: "Profile Updated" });
    } catch (err) {
      console.error("Error updating profile:", err);
      res.status(500).json({ success: false, message: err.message });
    }
  };

// Delete user account
exports.deleteAccount = async (req, res) => {
  try {
    const user = await pool.query("SELECT password FROM users WHERE id = $1;", [
      req.user.id,
    ]);

    // Check password
    const isMatch = await bcrypt.compare(
      req.body.password,
      user.rows[0].password
    );
    if (!isMatch)
      return res
        .status(400)
        .json({ success: false, message: "Password does not match" });

    // Delete user
    await pool.query("DELETE FROM users WHERE id = $1;", [req.user.id]);

    res
      .status(200)
      .json({ success: true, message: "Account deleted successfully" });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
