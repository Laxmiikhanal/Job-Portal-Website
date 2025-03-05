const { Pool } = require("pg");
const dotenv = require("dotenv");

dotenv.config({ path: "./config/config.env" });

const pool = new Pool({
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_NAME,
    password: String(process.env.DB_PASSWORD),  // ✅ Ensures it's a string
    port: process.env.DB_PORT || 5432,
    ssl: process.env.NODE_ENV === "production" ? { rejectUnauthorized: false } : false,
});

pool.connect()
    .then(() => console.log("✅ Connected to PostgreSQL Database"))
    .catch((err) => {
        console.error("❌ PostgreSQL Connection Error:", err);
        process.exit(1);
    });

module.exports = pool;
