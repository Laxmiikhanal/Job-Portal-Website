const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const { errorMiddleware } = require("./middlewares/error");
const path = require("path");

dotenv.config({ path: "./config/config.env" });

const app = express();

// Middleware
app.use(express.json({ limit: "10mb" }));
app.use(cors({ origin: "http://localhost:5173", credentials: true }));

// Serve static files from the 'uploads' folder
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Routes
const User = require("./routes/UserRoutes");
const Job = require("./routes/JobRoutes");
const Application = require("./routes/ApplicationRoutes");
const Admin = require("./routes/AdminRoutes");

app.use("/api/v1", User);
app.use("/api/v1", Job);
app.use("/api/v1", Application);
app.use("/api/v1", Admin);

// Root route
app.get("/", (req, res) => {
  res.json({ message: "I am working ✅" });
});

// Error handling middleware
app.use(errorMiddleware);

module.exports = app;