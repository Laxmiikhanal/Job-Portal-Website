const pool = require("../config/database");

// Get all jobs
const getAllJobs = async () => {
    const result = await pool.query("SELECT * FROM jobs;");
    return result.rows;
};

// Get job by ID
const getJobById = async (jobId) => {
    const result = await pool.query("SELECT * FROM jobs WHERE id = $1;", [jobId]);
    return result.rows[0];
};

// Create new job
const createJob = async (jobData) => {
    const { title, description, company_name, company_logo_url, location, skills_required, category, employment_type, experience, posted_by, salary, status } = jobData;
    const result = await pool.query(
        `INSERT INTO jobs (title, description, company_name, company_logo_url, location, skills_required, category, employment_type, experience, posted_by, salary, status) 
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12) RETURNING *;`,
        [title, description, company_name, company_logo_url, location, skills_required, category, employment_type, experience, posted_by, salary, status]
    );
    return result.rows[0];
};

module.exports = { getAllJobs, getJobById, createJob };