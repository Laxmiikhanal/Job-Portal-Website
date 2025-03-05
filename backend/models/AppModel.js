const pool = require("../config/database");

// Get all applications
const getAllApplications = async () => {
    const result = await pool.query("SELECT * FROM applications;");
    return result.rows;
};

// Get application by ID
const getApplicationById = async (applicationId) => {
    const result = await pool.query("SELECT * FROM applications WHERE id = $1;", [applicationId]);
    return result.rows[0];
};

// Create new application
const createApplication = async (applicationData) => {
    const { job_id, applicant_id, applicant_resume_url, status } = applicationData;
    const result = await pool.query(
        `INSERT INTO applications (job_id, applicant_id, applicant_resume_url, status) 
        VALUES ($1, $2, $3, $4) RETURNING *;`,
        [job_id, applicant_id, applicant_resume_url, status]
    );
    return result.rows[0];
};

module.exports = { getAllApplications, getApplicationById, createApplication };