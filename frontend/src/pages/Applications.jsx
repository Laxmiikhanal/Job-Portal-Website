import React, { useEffect, useState } from "react";
import { getApplications, deleteApplication } from "../services/api";
import ApplicationCard from "../components/ApplicationCard";

const Applications = () => {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchApplications = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          throw new Error("You must be logged in to view applications");
        }

        const data = await getApplications(token);
        setApplications(data.applications);
      } catch (error) {
        console.error("Error fetching applications:", error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchApplications();
  }, []);

  const handleDeleteApplication = async (applicationId) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("You must be logged in to delete an application");
      }

      await deleteApplication(applicationId, token);

      // Remove the deleted application from the state
      setApplications((prevApplications) =>
        prevApplications.filter((app) => app.id !== applicationId)
      );
    } catch (error) {
      console.error("Error deleting application:", error);
      alert(error.message);
    }
  };

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ height: "100vh" }}>
        <div className="spinner-border text-primary" role="status" style={{ width: "3rem", height: "3rem" }}>
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="alert alert-danger text-center mt-4">
        <strong>Error: </strong>{error}
      </div>
    );
  }

  if (applications.length === 0) {
    return (
      <div className="container mx-auto p-4">
        <h1 className="text-2xl font-bold mb-4">Applications</h1>
        <p className="text-gray-600">You have no applications.</p>
      </div>
    );
  }

  return (
    <div className="container mt-5">
      <h1 className="text-center mb-5">Your Applications</h1>
      <div className="row row-cols-1 row-cols-md-2 row-cols-lg-3 g-4">
        {applications.map((application) => (
          <div className="col" key={application.id}>
            <ApplicationCard
              application={application}
              onDelete={handleDeleteApplication}
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default Applications;
