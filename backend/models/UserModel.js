const pool = require("../config/database");

// Get all users
const getAllUsers = async () => {
    const result = await pool.query("SELECT * FROM users;");
    return result.rows;
};

// Get user by ID
const getUserById = async (userId) => {
    const result = await pool.query("SELECT * FROM users WHERE id = $1;", [userId]);
    return result.rows[0];
};

// Create new user
const createUser = async (userData) => {
    const { name, email, password, avatar_url, role, skills, resume_url } = userData;
    const result = await pool.query(
        `INSERT INTO users (name, email, password, avatar_url, role, skills, resume_url) 
        VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *;`,
        [name, email, password, avatar_url, role, skills, resume_url]
    );
    return result.rows[0];
};

module.exports = { getAllUsers, getUserById, createUser };