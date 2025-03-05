import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { register } from "../services/api";
import { FaUser, FaEnvelope, FaLock, FaTools, FaUserTag, FaFilePdf, FaImage } from "react-icons/fa";
import { Spinner } from "react-bootstrap"; // Adding Spinner for loading state

const Register = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [avatar, setAvatar] = useState(null);
  const [skills, setSkills] = useState("");
  const [resume, setResume] = useState(null);
  const [role, setRole] = useState("applicant");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false); // For loading state
  const navigate = useNavigate();

  const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

  const handleRegister = async (e) => {
    e.preventDefault();

    if (!avatar || !resume) {
      setError("Please select both an avatar and a resume.");
      return;
    }

    if (!avatar.type.startsWith("image/")) {
      setError("Avatar must be an image (JPEG, PNG, etc.).");
      return;
    }

    if (resume.type !== "application/pdf") {
      setError("Resume must be a PDF file.");
      return;
    }

    if (avatar.size > MAX_FILE_SIZE) {
      setError("Avatar file size must be less than 5MB.");
      return;
    }

    if (resume.size > MAX_FILE_SIZE) {
      setError("Resume file size must be less than 5MB.");
      return;
    }

    setLoading(true); // Start loading
    setError(""); // Reset error

    try {
      const formData = new FormData();
      formData.append("name", name);
      formData.append("email", email);
      formData.append("password", password);
      formData.append("skills", skills);
      formData.append("role", role);
      formData.append("avatar", avatar);
      formData.append("resume", resume);

      const data = await register(formData);

      if (data.success) {
        localStorage.setItem("token", data.token);
        navigate("/profile");
      } else {
        setError(data.message || "Registration failed. Please try again.");
      }
    } catch (err) {
      console.error("Registration error:", err);
      setError(err.message || "An error occurred. Please try again.");
    } finally {
      setLoading(false); // Stop loading
    }
  };

  return (
    <div className="min-vh-100 d-flex justify-content-center align-items-center bg-light">
      <div className="bg-white p-5 rounded shadow-sm w-100" style={{ maxWidth: "500px" }}>
        <h2 className="text-center mb-4">
          <FaUser className="mr-2" />
          Register
        </h2>
        
        {error && (
          <div className="alert alert-danger mb-4 p-2">
            {error}
          </div>
        )}

        <form onSubmit={handleRegister}>
          <div className="mb-3">
            <label htmlFor="name" className="form-label">
              <FaUser className="mr-2" />
              Name
            </label>
            <input
              type="text"
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="form-control"
              required
            />
          </div>

          <div className="mb-3">
            <label htmlFor="email" className="form-label">
              <FaEnvelope className="mr-2" />
              Email
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="form-control"
              required
            />
          </div>

          <div className="mb-3">
            <label htmlFor="password" className="form-label">
              <FaLock className="mr-2" />
              Password
            </label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="form-control"
              required
            />
          </div>

          <div className="mb-3">
            <label htmlFor="skills" className="form-label">
              <FaTools className="mr-2" />
              Skills (comma-separated)
            </label>
            <input
              type="text"
              id="skills"
              value={skills}
              onChange={(e) => setSkills(e.target.value)}
              className="form-control"
              required
            />
          </div>

          <div className="mb-3">
            <label htmlFor="role" className="form-label">
              <FaUserTag className="mr-2" />
              Role
            </label>
            <select
              id="role"
              value={role}
              onChange={(e) => setRole(e.target.value)}
              className="form-select"
              required
            >
              <option value="applicant">Applicant</option>
              <option value="admin">Admin</option>
            </select>
          </div>

          <div className="mb-3">
            <label htmlFor="avatar" className="form-label">
              <FaImage className="mr-2" />
              Avatar
            </label>
            <input
              type="file"
              id="avatar"
              onChange={(e) => setAvatar(e.target.files[0])}
              className="form-control"
              required
            />
          </div>

          <div className="mb-4">
            <label htmlFor="resume" className="form-label">
              <FaFilePdf className="mr-2" />
              Resume
            </label>
            <input
              type="file"
              id="resume"
              onChange={(e) => setResume(e.target.files[0])}
              className="form-control"
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="btn btn-primary w-100"
          >
            {loading ? (
              <Spinner animation="border" variant="light" size="sm" />
            ) : (
              "Register"
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Register;
