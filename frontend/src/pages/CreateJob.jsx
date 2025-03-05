import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createJob } from "../services/api";

const CreateJob = () => {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    companyName: "",
    location: "",
    skillsRequired: "",
    experience: "",
    salary: "",
    category: "",
    employmentType: "",
    status: "active", // default status
    logo: null, // file for logo
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  // Handle form input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  // Handle file input changes
  const handleFileChange = (e) => {
    setFormData((prevData) => ({ ...prevData, logo: e.target.files[0] }));
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("You must be logged in to create a job");
      }

      // Validate required fields
      if (!formData.logo) {
        throw new Error("Company logo is required");
      }

      // Format skills correctly (comma-separated)
      const formattedSkills = formData.skillsRequired
        .split(",")
        .map((skill) => skill.trim());

      // Create FormData object for API request
      const data = new FormData();
      data.append("title", formData.title);
      data.append("description", formData.description);
      data.append("companyName", formData.companyName);
      data.append("location", formData.location);
      data.append("skillsRequired", JSON.stringify(formattedSkills));
      data.append("experience", formData.experience);
      data.append("salary", formData.salary);
      data.append("category", formData.category);
      data.append("employmentType", formData.employmentType);
      data.append("status", formData.status);
      data.append("logo", formData.logo);

      // Call API to create the job
      const response = await createJob(data, token);

      if (response.success) {
        alert("Job created successfully!");
        navigate("/admin/dashboard"); // Redirect to admin dashboard
      } else {
        throw new Error("Failed to create job");
      }
    } catch (err) {
      setError(err.message); // Set error state to display message
      console.error("Job creation error:", err);
    } finally {
      setLoading(false); // Set loading to false after API call completes
    }
  };

  return (
    <div className="container mt-5">
      <div className="card shadow-lg p-4">
        <h1 className="text-center mb-4 text-primary">Create a New Job</h1>

        {/* Display error message if any */}
        {error && <div className="alert alert-danger mb-4">{error}</div>}

        {/* Form to create a job */}
        <form onSubmit={handleSubmit}>
          {/* Job Title */}
          <div className="mb-3">
            <label className="form-label">Job Title</label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              className="form-control form-control-lg shadow-sm"
              placeholder="Enter the job title"
              required
            />
          </div>

          {/* Job Description */}
          <div className="mb-3">
            <label className="form-label">Job Description</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              className="form-control form-control-lg shadow-sm"
              placeholder="Describe the job in detail"
              rows="4"
              required
            />
          </div>

          {/* Company Name */}
          <div className="mb-3">
            <label className="form-label">Company Name</label>
            <input
              type="text"
              name="companyName"
              value={formData.companyName}
              onChange={handleChange}
              className="form-control form-control-lg shadow-sm"
              placeholder="Enter the company name"
              required
            />
          </div>

          {/* Location */}
          <div className="mb-3">
            <label className="form-label">Location</label>
            <input
              type="text"
              name="location"
              value={formData.location}
              onChange={handleChange}
              className="form-control form-control-lg shadow-sm"
              placeholder="Enter job location"
              required
            />
          </div>

          {/* Skills Required */}
          <div className="mb-3">
            <label className="form-label">Skills Required (comma-separated)</label>
            <input
              type="text"
              name="skillsRequired"
              value={formData.skillsRequired}
              onChange={handleChange}
              className="form-control form-control-lg shadow-sm"
              placeholder="Enter skills (e.g., JavaScript, React)"
              required
            />
          </div>

          {/* Experience */}
          <div className="mb-3">
            <label className="form-label">Experience</label>
            <input
              type="text"
              name="experience"
              value={formData.experience}
              onChange={handleChange}
              className="form-control form-control-lg shadow-sm"
              placeholder="Enter required experience"
              required
            />
          </div>

          {/* Salary */}
          <div className="mb-3">
            <label className="form-label">Salary</label>
            <input
              type="text"
              name="salary"
              value={formData.salary}
              onChange={handleChange}
              className="form-control form-control-lg shadow-sm"
              placeholder="Enter salary range"
              required
            />
          </div>

          {/* Category */}
          <div className="mb-3">
            <label className="form-label">Category</label>
            <input
              type="text"
              name="category"
              value={formData.category}
              onChange={handleChange}
              className="form-control form-control-lg shadow-sm"
              placeholder="Enter job category"
              required
            />
          </div>

          {/* Employment Type */}
          <div className="mb-3">
            <label className="form-label">Employment Type</label>
            <input
              type="text"
              name="employmentType"
              value={formData.employmentType}
              onChange={handleChange}
              className="form-control form-control-lg shadow-sm"
              placeholder="Enter employment type (Full-time, Part-time, etc.)"
              required
            />
          </div>

          {/* Company Logo */}
          <div className="mb-3">
            <label className="form-label">Company Logo</label>
            <input
              type="file"
              name="logo"
              onChange={handleFileChange}
              className="form-control form-control-lg shadow-sm"
              required
            />
          </div>

          {/* Submit Button */}
          <div className="mb-3 text-center">
            <button
              type="submit"
              disabled={loading}
              className="btn btn-primary btn-lg w-100 shadow-sm"
            >
              {loading ? "Creating..." : "Create Job"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateJob;
