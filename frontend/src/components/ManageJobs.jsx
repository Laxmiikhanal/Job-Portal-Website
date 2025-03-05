import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { allJobs, deleteJob, updateJob } from "../services/api";

const ManageJobs = () => {
  const [jobs, setJobs] = useState([]);
  const [editingJob, setEditingJob] = useState(null); // Track the job being edited
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
    status: "active",
  });
  const navigate = useNavigate();

  // Fetch all jobs on component mount
  useEffect(() => {
    fetchJobs();
  }, []);

  // Fetch all jobs
  const fetchJobs = async () => {
    try {
      const response = await allJobs();
      setJobs(response.jobs);
    } catch (err) {
      alert("Failed to fetch jobs: " + err.message);
    }
  };

  // Handle delete job
  const handleDelete = async (id) => {
    try {
      await deleteJob(id);
      fetchJobs(); // Refresh the list
      alert("Job deleted successfully!");
    } catch (err) {
      alert("Failed to delete job: " + err.message);
    }
  };

  // Handle edit job (open edit form)
  const handleEdit = (job) => {
    setEditingJob(job);
    setFormData({
      title: job.title,
      description: job.description,
      companyName: job.company_name,
      location: job.location,
      skillsRequired: job.skills_required.join(", "),
      experience: job.experience,
      salary: job.salary,
      category: job.category,
      employmentType: job.employment_type,
      status: job.status,
    });
  };

  // Handle form input change
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Handle form submission for updating a job
  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      await updateJob(editingJob.id, formData);
      setEditingJob(null); // Close the edit form
      fetchJobs(); // Refresh the list
      alert("Job updated successfully!");
    } catch (err) {
      alert("Failed to update job: " + err.message);
    }
  };

  return (
    <div className="manage-jobs">
      <h2>Manage Jobs</h2>
      <button onClick={() => navigate("/admin/create-job")} className="create-button">
        Create New Job
      </button>
      <table>
        <thead>
          <tr>
            <th>Title</th>
            <th>Company</th>
            <th>Location</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {jobs.map((job) => (
            <tr key={job.id}>
              <td>{job.title}</td>
              <td>{job.company_name}</td>
              <td>{job.location}</td>
              <td>{job.status}</td>
              <td>
                <button onClick={() => handleEdit(job)} className="edit-button">
                  Edit
                </button>
                <button onClick={() => handleDelete(job.id)} className="delete-button">
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Edit Job Modal */}
      {editingJob && (
        <div className="edit-modal">
          <h3>Edit Job</h3>
          <form onSubmit={handleUpdate}>
            <input
              type="text"
              name="title"
              placeholder="Job Title"
              value={formData.title}
              onChange={handleChange}
              required
            />
            <textarea
              name="description"
              placeholder="Job Description"
              value={formData.description}
              onChange={handleChange}
              required
            />
            <input
              type="text"
              name="companyName"
              placeholder="Company Name"
              value={formData.companyName}
              onChange={handleChange}
              required
            />
            <input
              type="text"
              name="location"
              placeholder="Location"
              value={formData.location}
              onChange={handleChange}
              required
            />
            <input
              type="text"
              name="skillsRequired"
              placeholder="Skills Required (comma-separated)"
              value={formData.skillsRequired}
              onChange={handleChange}
              required
            />
            <input
              type="text"
              name="experience"
              placeholder="Experience"
              value={formData.experience}
              onChange={handleChange}
              required
            />
            <input
              type="text"
              name="salary"
              placeholder="Salary"
              value={formData.salary}
              onChange={handleChange}
              required
            />
            <input
              type="text"
              name="category"
              placeholder="Category"
              value={formData.category}
              onChange={handleChange}
              required
            />
            <input
              type="text"
              name="employmentType"
              placeholder="Employment Type"
              value={formData.employmentType}
              onChange={handleChange}
              required
            />
            <select
              name="status"
              value={formData.status}
              onChange={handleChange}
              required
            >
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
            <button type="submit">Update Job</button>
            <button type="button" onClick={() => setEditingJob(null)}>
              Cancel
            </button>
          </form>
        </div>
      )}
    </div>
  );
};

export default ManageJobs;