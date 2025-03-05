import React, { useEffect, useState } from "react";
import {
  getAllApplications,
  getApplication,
  updateApplication,
  deleteApplication,
} from "../services/api";

const ManageApplications = () => {
  const [applications, setApplications] = useState([]);
  const [selectedApplication, setSelectedApplication] = useState(null); // Track the selected application for details
  const [editingApplication, setEditingApplication] = useState(null); // Track the application being edited
  const [status, setStatus] = useState(""); // Track the status for the edit form

  // Fetch all applications on component mount
  useEffect(() => {
    fetchApplications();
  }, []);

  // Fetch all applications
  const fetchApplications = async () => {
    try {
      const response = await getAllApplications();
      setApplications(response.applications);
    } catch (err) {
      alert("Failed to fetch applications: " + err.message);
    }
  };

  // Fetch details of a single application
  const fetchApplicationDetails = async (id) => {
    try {
      const response = await getApplication(id);
      setSelectedApplication(response.application);
    } catch (err) {
      alert("Failed to fetch application details: " + err.message);
    }
  };

  // Handle delete application
  const handleDelete = async (id) => {
    try {
      await deleteApplication(id);
      fetchApplications(); // Refresh the list
      alert("Application deleted successfully!");
    } catch (err) {
      alert("Failed to delete application: " + err.message);
    }
  };

  // Handle edit application (open edit form)
  const handleEdit = (application) => {
    setEditingApplication(application);
    setStatus(application.status); // Set the initial status
  };

  // Handle status change
  const handleStatusChange = (e) => {
    setStatus(e.target.value);
  };

  // Handle form submission for updating an application
  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      await updateApplication(editingApplication.id, { status });
      setEditingApplication(null); // Close the edit form
      fetchApplications(); // Refresh the list
      alert("Application updated successfully!");
    } catch (err) {
      alert("Failed to update application: " + err.message);
    }
  };

  return (
    <div className="manage-applications">
      <h2>Manage Applications</h2>

      {/* Table to display all applications */}
      <table>
        <thead>
          <tr>
            <th>Job Title</th>
            <th>Applicant Name</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {applications.map((application) => (
            <tr key={application.id}>
              <td>{application.job_title}</td>
              <td>{application.applicant_name}</td>
              <td>{application.status}</td>
              <td>
                <button
                  onClick={() => fetchApplicationDetails(application.id)}
                  className="view-button"
                >
                  View
                </button>
                <button
                  onClick={() => handleEdit(application)}
                  className="edit-button"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(application.id)}
                  className="delete-button"
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Modal to display application details */}
      {selectedApplication && (
        <div className="modal">
          <div className="modal-content">
            <h3>Application Details</h3>
            <p>
              <strong>Job Title:</strong> {selectedApplication.job_title}
            </p>
            <p>
              <strong>Applicant Name:</strong> {selectedApplication.applicant_name}
            </p>
            <p>
              <strong>Status:</strong> {selectedApplication.status}
            </p>
            <p>
              <strong>Applied At:</strong>{" "}
              {new Date(selectedApplication.created_at).toLocaleString()}
            </p>
            <button onClick={() => setSelectedApplication(null)}>Close</button>
          </div>
        </div>
      )}

      {/* Modal to edit application status */}
      {editingApplication && (
        <div className="modal">
          <div className="modal-content">
            <h3>Edit Application Status</h3>
            <form onSubmit={handleUpdate}>
              <label>
                Status:
                <select value={status} onChange={handleStatusChange} required>
                  <option value="pending">Pending</option>
                  <option value="approved">Approved</option>
                  <option value="rejected">Rejected</option>
                </select>
              </label>
              <button type="submit">Update</button>
              <button type="button" onClick={() => setEditingApplication(null)}>
                Cancel
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManageApplications;