import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getJob, applyForJob } from "../services/api";
import { FaMapMarkerAlt, FaMoneyBillAlt, FaBriefcase, FaCheckCircle } from "react-icons/fa";

const JobDetail = () => {
  const { id } = useParams();
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchJob = async () => {
      try {
        const response = await getJob(id);
        setJob(response.job);
      } catch (error) {
        console.error("Error fetching job details:", error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchJob();
  }, [id]);

  const handleApply = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("You must be logged in to apply for a job");
      }

      const data = await applyForJob(id, token);
      console.log("Application submitted:", data);
      alert("Application submitted successfully!");
    } catch (error) {
      console.error("Apply for job error:", error);
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

  if (!job) {
    return <div>Job not found</div>;
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-4" style={{ color: "#2c3e50" }}>{job.title}</h1>
      <div className="card shadow-sm p-4">
        <div className="mb-4">
          <h4 className="font-weight-bold" style={{ color: "#2c3e50" }}>Job Details</h4>
          <div className="d-flex align-items-center mb-2">
            <FaMapMarkerAlt className="me-2 text-muted" />
            <p className="mb-0" style={{ color: "#7f8c8d" }}>{job.location}</p>
          </div>
          <div className="d-flex align-items-center mb-2">
            <FaMoneyBillAlt className="me-2 text-muted" />
            <p className="mb-0" style={{ color: "#7f8c8d" }}>{job.salary}</p>
          </div>
          <div className="d-flex align-items-center mb-2">
            <FaBriefcase className="me-2 text-muted" />
            <p className="mb-0" style={{ color: "#7f8c8d" }}>{job.employment_type}</p>
          </div>
        </div>
        <div className="mb-4">
          <h4 className="font-weight-bold" style={{ color: "#2c3e50" }}>Description</h4>
          <p className="text-muted">{job.description}</p>
        </div>
        <div className="mb-4">
          <h4 className="font-weight-bold" style={{ color: "#2c3e50" }}>Skills Required</h4>
          <p className="text-muted">{job.skills_required.join(", ")}</p>
        </div>
        <button
          onClick={handleApply}
          className="btn btn-primary w-100 py-2"
          style={{ borderRadius: "8px" }}
        >
          <FaCheckCircle className="me-2" />
          Apply for this Job
        </button>
      </div>
    </div>
  );
};

export default JobDetail;