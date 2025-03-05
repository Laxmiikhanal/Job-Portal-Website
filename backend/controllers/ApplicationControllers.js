const pool = require("../config/database");

// Create a new application
exports.createApplication = async (req, res) => {
    try {
      const { id: job_id } = req.params;
      const { id: applicant_id } = req.user; // Assuming `req.user` contains authenticated user info
  
      // Check if job exists
      const job = await pool.query("SELECT id FROM jobs WHERE id = $1;", [job_id]);
      if (job.rows.length === 0) {
        return res.status(404).json({ success: false, message: "Job not found" });
      }
  
      // Check if user already applied
      const existingApplication = await pool.query(
        "SELECT id FROM applications WHERE job_id = $1 AND applicant_id = $2;",
        [job_id, applicant_id]
      );
      if (existingApplication.rows.length > 0) {
        return res.status(400).json({ success: false, message: "You have already applied for this job" });
      }
  
      // Get user's resume URL
      const user = await pool.query("SELECT resume_url FROM users WHERE id = $1;", [applicant_id]);
  
      // Check if the user has uploaded a resume
      if (!user.rows[0].resume_url) {
        return res.status(400).json({ success: false, message: "You must upload a resume to apply for jobs" });
      }
  
      // Insert new application
      const application = await pool.query(
        `INSERT INTO applications (job_id, applicant_id, applicant_resume_url, status) 
         VALUES ($1, $2, $3, 'pending') RETURNING *;`,
        [job_id, applicant_id, user.rows[0].resume_url]
      );
  
      res.status(200).json({ success: true, message: "Application created", application: application.rows[0] });
    } catch (err) {
      console.error("Create application error:", err);
      res.status(500).json({ success: false, message: err.message });
    }
  };
// Get a single application
// Get a single application
exports.getSingleApplication = async (req, res) => {
    try {
      const application = await pool.query(
        `SELECT 
           applications.*, 
           jobs.title AS job_title, 
           jobs.description AS job_description, 
           jobs.company_name, 
           users.resume_url AS applicant_resume_url 
         FROM applications 
         JOIN jobs ON applications.job_id = jobs.id 
         JOIN users ON applications.applicant_id = users.id 
         WHERE applications.id = $1;`,
        [req.params.id]
      );
  
      if (application.rows.length === 0) {
        return res.status(404).json({ success: false, message: "Application not found" });
      }
  
      res.status(200).json({ success: true, application: application.rows[0] });
    } catch (err) {
      console.error("Get single application error:", err); // Debugging: Log the error
      res.status(500).json({ success: false, message: err.message });
    }
  };

// Get all applications of a user
exports.getUsersAllApplications = async (req, res) => {
    try {
        const applications = await pool.query(`
            SELECT applications.*, jobs.title AS job_title 
            FROM applications 
            JOIN jobs ON applications.job_id = jobs.id 
            WHERE applications.applicant_id = $1;
        `, [req.user.id]);

        res.status(200).json({ success: true, applications: applications.rows });

    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};

// Delete application
exports.deleteApplication = async (req, res) => {
    try {
        const { id: applicationId } = req.params;
        const { id: userId } = req.user;

        // Check if application exists
        const application = await pool.query("SELECT job_id FROM applications WHERE id = $1 AND applicant_id = $2;", [applicationId, userId]);

        if (application.rows.length === 0) {
            return res.status(400).json({ success: false, message: "Application not found or already deleted" });
        }

        // Delete application
        await pool.query("DELETE FROM applications WHERE id = $1;", [applicationId]);

        res.status(200).json({ success: true, message: "Application deleted" });

    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};
