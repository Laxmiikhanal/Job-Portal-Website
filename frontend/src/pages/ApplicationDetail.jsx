import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getApplication } from "../services/api";

const ApplicationDetail = () => {
  const { id } = useParams();
  const [application, setApplication] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchApplication = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          throw new Error("You must be logged in to view application details");
        }

        const data = await getApplication(id, token);
        setApplication(data.application);
      } catch (error) {
        console.error("Error fetching application details:", error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchApplication();
  }, [id]);

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

  if (!application) {
    return (
      <div className="alert alert-warning text-center mt-4">
        <strong>Application not found!</strong>
      </div>
    );
  }

  // Construct the absolute URL for the resume
  const resumeUrl = `http://localhost:8000${application.applicant_resume_url}`;

  return (
    <div className="container mt-5">
      <h1 className="text-center mb-4">Application Details</h1>

      <div className="card p-4 shadow-sm">
        <div className="mb-3">
          <h5 className="card-title">Job Title: {application.job_title}</h5>
          <p className="card-text"><strong>Company:</strong> {application.company_name}</p>
          <p className="card-text"><strong>Status:</strong> {application.status}</p>
          <p className="card-text"><strong>Job Description:</strong> {application.job_description}</p>
          <p className="card-text"><strong>Resume:</strong> 
            <a href={resumeUrl} target="_blank" rel="noopener noreferrer" className="text-primary">
              View Resume
            </a>
          </p>
        </div>

        <button onClick={() => window.history.back()} className="btn btn-secondary">Back to Applications</button>
      </div>
    </div>
  );
};

export default ApplicationDetail;
