const pool = require("../config/database");
const fs = require("fs");

// Create a new job
exports.createJob = async (req, res) => { 
    try {
      const {
        title,
        description,
        companyName,
        location,
        skillsRequired,
        experience,
        salary,
        category,
        employmentType,
        status,
      } = req.body;
  
      // Ensure the user is authenticated
      if (!req.user || !req.user.id) {
        return res.status(401).json({ success: false, message: "Unauthorized: User not authenticated" });
      }
  
      const postedBy = req.user.id; // Get the user ID from the authenticated user
  
      // Validate required fields
      if (!req.file) {
        return res.status(400).json({ success: false, message: "Company logo is required" });
      }
  
      // Get file path
      const logoPath = req.file.path; // Path to the uploaded logo
  
      // Format skills correctly
      const formattedSkills = Array.isArray(skillsRequired) ? skillsRequired : skillsRequired.split(",");
  
      // Insert job into PostgreSQL
      const newJob = await pool.query(
        `INSERT INTO jobs (title, description, company_name, company_logo_url, location, skills_required, category, employment_type, experience, posted_by, salary, status) 
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12) RETURNING *;`,
        [
          title,
          description,
          companyName,
          logoPath,
          location,
          formattedSkills,
          category,
          employmentType,
          experience,
          postedBy, // Use the authenticated user's ID
          salary,
          status || "active",
        ]
      );
  
      res.status(201).json({ success: true, message: "Job created successfully", job: newJob.rows[0] });
    } catch (err) {
      console.error("Job Creation Error:", err);
  
      // Delete uploaded file if an error occurs
      if (req.file) {
        fs.unlinkSync(req.file.path);
      }
  
      res.status(500).json({ success: false, message: err.message });
    }
  };

// Get all jobs
exports.allJobs = async (req, res) => {
    try {
        const jobs = await pool.query("SELECT * FROM jobs;");
        res.status(200).json({ success: true, jobs: jobs.rows });

    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};

// Get a single job with postedBy details
exports.oneJob = async (req, res) => {
    try {
        const job = await pool.query(`
            SELECT jobs.*, users.name AS posted_by_name 
            FROM jobs 
            JOIN users ON jobs.posted_by = users.id 
            WHERE jobs.id = $1;
        `, [req.params.id]);

        if (job.rows.length === 0) {
            return res.status(404).json({ success: false, message: "Job not found" });
        }

        res.status(200).json({ success: true, job: job.rows[0] });

    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};

// Save or unsave a job
exports.saveJob = async (req, res) => {
    try {
      const userId = req.user.id; // Ensure this is correctly set by the `isAuthenticated` middleware
      const jobId = req.params.id; // Ensure this is correctly set by the route
  
      // Debugging: Log the userId and jobId
      console.log("User ID:", userId);
      console.log("Job ID:", jobId);
  
      // Check if the job exists in the database
      const jobExists = await pool.query("SELECT id FROM jobs WHERE id = $1;", [jobId]);
      if (jobExists.rows.length === 0) {
        return res.status(404).json({ success: false, message: "Job not found" });
      }
  
      // Check if the job is already saved by the user
      const checkSaved = await pool.query(
        "SELECT * FROM saved_jobs WHERE user_id = $1 AND job_id = $2;",
        [userId, jobId]
      );
  
      if (checkSaved.rows.length > 0) {
        // Unsave the job
        await pool.query(
          "DELETE FROM saved_jobs WHERE user_id = $1 AND job_id = $2;",
          [userId, jobId]
        );
        return res.status(200).json({ success: true, message: "Job Unsaved" });
      } else {
        // Save the job
        await pool.query(
          "INSERT INTO saved_jobs (user_id, job_id) VALUES ($1, $2);",
          [userId, jobId]
        );
        return res.status(200).json({ success: true, message: "Job saved" });
      }
    } catch (err) {
      console.error("Save Job Error:", err); // Debugging: Log the full error
      res.status(500).json({ success: false, message: err.message });
    }
  };

// Get all saved jobs of a user
exports.getSavedJobs = async (req, res) => {
    try {
        const savedJobs = await pool.query(`
            SELECT jobs.* 
            FROM saved_jobs 
            JOIN jobs ON saved_jobs.job_id = jobs.id 
            WHERE saved_jobs.user_id = $1;
        `, [req.user.id]);

        res.status(200).json({ success: true, savedJobs: savedJobs.rows });

    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};
