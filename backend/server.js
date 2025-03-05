const app = require("./app");
const pool = require("./config/database"); // PostgreSQL connection
const cloudinary = require("cloudinary");
const dotenv = require("dotenv");

dotenv.config({ path: "./config/config.env" });

// Cloudinary configuration
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

// Ensure PostgreSQL is connected before starting the server
pool.connect()
    .then(() => {
        console.log("✅ Connected to PostgreSQL Database");

        // Start the server after database connection is successful
        const PORT = process.env.PORT || 5000;
        app.listen(PORT, () => {
            console.log(`🚀 Server is running on port ${PORT}`);
            console.log("JWT_SECRET:", process.env.JWT_SECRET ? "✅ Loaded" : "❌ Missing");
        });
    })
    .catch((err) => {
        console.error("❌ PostgreSQL Connection Error:", err);
        process.exit(1); // Exit process if database connection fails
    });
