import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  getAllJobs,
  deleteJob,
  getAllUsers,
  getAllApplications,
  updateApplicationStatus,
  deleteApplicationAdmin,
  updateUserRole,
  deleteUser,
} from "../services/api";

const AdminDashboard = () => {
  const [jobs, setJobs] = useState([]);
  const [users, setUsers] = useState([]);
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  // Fetch all data on component mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          throw new Error("You must be logged in to access the admin dashboard");
        }

        // Fetch jobs, users, and applications
        const jobsData = await getAllJobs(token);
        const usersData = await getAllUsers(token);
        const applicationsData = await getAllApplications(token);

        setJobs(jobsData.jobs);
        setUsers(usersData.users);
        setApplications(applicationsData.applications);
      } catch (err) {
        setError(err.message);
        console.error("Error fetching data:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Handle delete job
  const handleDeleteJob = async (jobId) => {
    try {
      const token = localStorage.getItem("token");
      await deleteJob(jobId, token);

      // Remove the deleted job from the state
      setJobs((prevJobs) => prevJobs.filter((job) => job.id !== jobId));
      alert("Job deleted successfully!");
    } catch (err) {
      alert("Failed to delete job: " + err.message);
    }
  };

  // Handle edit job
  const handleEditJob = (jobId) => {
    navigate(`/admin/edit-job/${jobId}`); // Navigate to the edit job page
  };

  // Handle update application status
  const handleUpdateApplicationStatus = async (applicationId, status) => {
    try {
      const token = localStorage.getItem("token");
      await updateApplicationStatus(applicationId, status, token);

      // Update the application status in the state
      setApplications((prevApplications) =>
        prevApplications.map((app) =>
          app.id === applicationId ? { ...app, status } : app
        )
      );
    } catch (err) {
      console.error("Error updating application status:", err);
      alert(err.message);
    }
  };

  // Handle delete application
  const handleDeleteApplication = async (applicationId) => {
    try {
      const token = localStorage.getItem("token");
      await deleteApplicationAdmin(applicationId, token);

      // Remove the deleted application from the state
      setApplications((prevApplications) =>
        prevApplications.filter((app) => app.id !== applicationId)
      );
    } catch (err) {
      console.error("Error deleting application:", err);
      alert(err.message);
    }
  };

  // Handle update user role with dropdown
  const handleUpdateUserRole = async (userId, role) => {
    try {
      const token = localStorage.getItem("token");
      await updateUserRole(userId, role, token);

      // Update the user role in the state
      setUsers((prevUsers) =>
        prevUsers.map((user) =>
          user.id === userId ? { ...user, role } : user
        )
      );
    } catch (err) {
      console.error("Error updating user role:", err);
      alert(err.message);
    }
  };

  // Handle delete user
  const handleDeleteUser = async (userId) => {
    try {
      const token = localStorage.getItem("token");
      await deleteUser(userId, token);

      // Remove the deleted user from the state
      setUsers((prevUsers) => prevUsers.filter((user) => user.id !== userId));
    } catch (err) {
      console.error("Error deleting user:", err);
      alert(err.message);
    }
  };

  if (loading) {
    return <div className="text-center text-xl text-gray-700 py-12">Loading...</div>;
  }

  if (error) {
    return <div className="text-danger text-center mt-4 text-xl">{error}</div>;
  }

  return (
    <div className="container my-4">
      <h1 className="text-center text-3xl font-bold mb-5">Admin Dashboard</h1>

      {/* Jobs Section */}
      <section className="mb-5">
        <h2 className="h4 mb-3">Manage Jobs</h2>
        <button
          onClick={() => navigate("/admin/create-job")}
          className="btn btn-primary mb-4"
        >
          Create New Job
        </button>
        <table className="table table-bordered">
          <thead>
            <tr>
              <th>Job Title</th>
              <th>Company Name</th>
              <th>Location</th>
              <th>Salary</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {jobs.map((job) => (
              <tr key={job.id}>
                <td>{job.title}</td>
                <td>{job.company_name}</td>
                <td>{job.location}</td>
                <td>{job.salary}</td>
                <td>
                  <button
                    onClick={() => handleEditJob(job.id)}
                    className="btn btn-warning btn-sm me-2"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDeleteJob(job.id)}
                    className="btn btn-danger btn-sm"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>

      {/* Users Section */}
      <section className="mb-5">
        <h2 className="h4 mb-3">Manage Users</h2>
        <table className="table table-bordered">
          <thead>
            <tr>
              <th>User Name</th>
              <th>Email</th>
              <th>Role</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user.id}>
                <td>{user.name}</td>
                <td>{user.email}</td>
                <td>
                  <select
                    value={user.role}
                    onChange={(e) => handleUpdateUserRole(user.id, e.target.value)}
                    className="form-select form-select-sm"
                  >
                    <option value="admin">Admin</option>
                    <option value="applicant">Applicant</option>
                  </select>
                </td>
                <td>
                  <button
                    onClick={() => handleDeleteUser(user.id)}
                    className="btn btn-danger btn-sm"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>

      {/* Applications Section */}
      <section>
        <h2 className="h4 mb-3">Manage Applications</h2>
        <table className="table table-bordered">
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
                    onClick={() => handleUpdateApplicationStatus(application.id, "accepted")}
                    className="btn btn-success btn-sm me-2"
                  >
                    Accept
                  </button>
                  <button
                    onClick={() => handleUpdateApplicationStatus(application.id, "rejected")}
                    className="btn btn-danger btn-sm me-2"
                  >
                    Reject
                  </button>
                  <button
                    onClick={() => handleDeleteApplication(application.id)}
                    className="btn btn-secondary btn-sm"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
    </div>
  );
};

export default AdminDashboard;
