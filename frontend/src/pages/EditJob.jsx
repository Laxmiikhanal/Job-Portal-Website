import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getJobById, updateJob } from "../services/api";

const EditJob = () => {
  const { id } = useParams(); // Get the job ID from the URL
  const navigate = useNavigate();
  const [job, setJob] = useState({
    title: "",
    description: "",
    companyName: "",
    location: "",
    skillsRequired: "",
    experience: "",
    salary: "",
    category: "",
    employmentType: "",
    status: "",
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch job details on component mount
  useEffect(() => {
    const fetchJob = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await getJobById(id, token);
        setJob(response.job);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchJob();
  }, [id]);

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setJob((prevJob) => ({
      ...prevJob,
      [name]: value,
    }));
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      await updateJob(id, job, token);
      alert("Job updated successfully!");
      navigate("/admin/dashboard"); // Redirect to the admin dashboard
    } catch (err) {
      alert("Failed to update job: " + err.message);
    }
  };

  if (loading) {
    return <div className="text-center">Loading...</div>;
  }

  if (error) {
    return <div className="alert alert-danger text-center mt-4">Error: {error}</div>;
  }

  return (
    <div className="container mt-5">
      <div className="card shadow-lg p-4">
        <h1 className="text-center mb-4 text-primary">Edit Job</h1>

        {/* Display error message if any */}
        {error && <div className="alert alert-danger mb-4">{error}</div>}

        {/* Form to update the job */}
        <form onSubmit={handleSubmit}>
          {/* Job Title */}
          <div className="mb-3">
            <label className="form-label">Title</label>
            <input
              type="text"
              name="title"
              value={job.title}
              onChange={handleInputChange}
              className="form-control form-control-lg shadow-sm"
              placeholder="Enter the job title"
              required
            />
          </div>

          {/* Job Description */}
          <div className="mb-3">
            <label className="form-label">Description</label>
            <textarea
              name="description"
              value={job.description}
              onChange={handleInputChange}
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
              value={job.companyName}
              onChange={handleInputChange}
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
              value={job.location}
              onChange={handleInputChange}
              className="form-control form-control-lg shadow-sm"
              placeholder="Enter job location"
              required
            />
          </div>

          {/* Skills Required */}
          <div className="mb-3">
            <label className="form-label">Skills Required</label>
            <input
              type="text"
              name="skillsRequired"
              value={job.skillsRequired}
              onChange={handleInputChange}
              className="form-control form-control-lg shadow-sm"
              placeholder="Enter skills (comma separated)"
              required
            />
          </div>

          {/* Experience */}
          <div className="mb-3">
            <label className="form-label">Experience</label>
            <input
              type="text"
              name="experience"
              value={job.experience}
              onChange={handleInputChange}
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
              value={job.salary}
              onChange={handleInputChange}
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
              value={job.category}
              onChange={handleInputChange}
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
              value={job.employmentType}
              onChange={handleInputChange}
              className="form-control form-control-lg shadow-sm"
              placeholder="Enter employment type"
              required
            />
          </div>

          {/* Status */}
          <div className="mb-3">
            <label className="form-label">Status</label>
            <select
              name="status"
              value={job.status}
              onChange={handleInputChange}
              className="form-select form-select-lg shadow-sm"
              required
            >
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
          </div>

          {/* Submit Button */}
          <div className="mb-3 text-center">
            <button
              type="submit"
              disabled={loading}
              className="btn btn-primary btn-lg w-100 shadow-sm"
            >
              {loading ? "Updating..." : "Update Job"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditJob;
