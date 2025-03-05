const pool = require("../config/database");
const fs = require("fs");

// Get all jobs
exports.getAllJobs = async (req, res) => {
    try {
        const jobs = await pool.query("SELECT * FROM jobs;");
        res.status(200).json({ success: true, jobs: jobs.rows });

    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};

// Get all users
exports.getAllUsers = async (req, res) => {
    try {
        const users = await pool.query("SELECT * FROM users;");
        res.status(200).json({ success: true, users: users.rows });

    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};

// Get all applications
exports.getAllApplications = async (req, res) => {
    try {
        const applications = await pool.query(`
            SELECT applications.*, jobs.title AS job_title, users.name AS applicant_name 
            FROM applications 
            JOIN jobs ON applications.job_id = jobs.id 
            JOIN users ON applications.applicant_id = users.id;
        `);

        res.status(200).json({ success: true, applications: applications.rows });

    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};

// Get single application
exports.getApplication = async (req, res) => {
    try {
        const application = await pool.query(`
            SELECT applications.*, jobs.title AS job_title, users.name AS applicant_name 
            FROM applications 
            JOIN jobs ON applications.job_id = jobs.id 
            JOIN users ON applications.applicant_id = users.id 
            WHERE applications.id = $1;
        `, [req.params.id]);

        res.status(200).json({ success: true, application: application.rows[0] });

    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};

// Update application status
exports.updateApplication = async (req, res) => {
    try {
        await pool.query("UPDATE applications SET status = $1 WHERE id = $2;", [req.body.status, req.params.id]);

        res.status(200).json({ success: true, message: "Application Updated" });

    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};

// Delete application
exports.deleteApplication = async (req, res) => {
    try {
        await pool.query("DELETE FROM applications WHERE id = $1;", [req.params.id]);

        res.status(200).json({ success: true, message: "Application Deleted" });

    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};

// Update user role
exports.updateUser = async (req, res) => {
    try {
        await pool.query("UPDATE users SET role = $1 WHERE id = $2;", [req.body.role, req.params.id]);

        res.status(200).json({ success: true, message: "User role updated" });

    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};

// Delete user
exports.deleteUser = async (req, res) => {
    try {
        await pool.query("DELETE FROM users WHERE id = $1;", [req.params.id]);

        res.status(200).json({ success: true, message: "User Deleted" });

    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};

// Get single user
exports.getUser = async (req, res) => {
    try {
        const user = await pool.query("SELECT * FROM users WHERE id = $1;", [req.params.id]);

        res.status(200).json({ success: true, user: user.rows[0] });

    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};

// Update job details & handle local image update

exports.updateJob = async (req, res) => {
    try {
      const { id } = req.params;
  
      // Fetch current job details
      const job = await pool.query("SELECT * FROM jobs WHERE id = $1;", [id]);
      if (job.rows.length === 0) {
        return res.status(404).json({ success: false, message: "Job not found" });
      }
  
      // Delete old company logo if a new one is uploaded
      let logoPath = job.rows[0].company_logo_url; // Keep the old logo if no new one is uploaded
      if (req.file) {
        if (logoPath && fs.existsSync(logoPath)) {
          fs.unlinkSync(logoPath); // Safely delete existing logo
        }
        logoPath = req.file.path; // Assign new logo path
      }
  
      // Format skills correctly (ensure it's an array)
      let formattedSkills = req.body.skillsRequired;
      if (typeof formattedSkills === "string") {
        formattedSkills = formattedSkills.split(",").map(skill => skill.trim());
      }
  
      // Update job details in the database
      await pool.query(
        `UPDATE jobs SET title = $1, description = $2, company_name = $3, company_logo_url = $4, 
        location = $5, skills_required = $6, category = $7, employment_type = $8, experience = $9, salary = $10, status = $11
        WHERE id = $12;`,
        [
          req.body.title,
          req.body.description,
          req.body.company_name || req.body.companyName, // Normalize company name
          logoPath,
          req.body.location,
          formattedSkills, // Ensure skills are stored properly
          req.body.category,
          req.body.employmentType,
          req.body.experience,
          req.body.salary,
          req.body.status || "active",
          id,
        ]
      );
  
      res.status(200).json({ success: true, message: "Job updated successfully" });
    } catch (err) {
      console.error("Job Update Error:", err);
      res.status(500).json({ success: false, message: err.message });
    }
  };
// Get single job
exports.getJob = async (req, res) => {
    try {
        const job = await pool.query("SELECT * FROM jobs WHERE id = $1;", [req.params.id]);

        res.status(200).json({ success: true, job: job.rows[0] });

    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};

// Delete job
exports.deleteJob = async (req, res) => {
    try {
        await pool.query("DELETE FROM jobs WHERE id = $1;", [req.params.id]);

        res.status(200).json({ success: true, message: "Job Deleted" });

    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};
