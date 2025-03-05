import React, { useState } from "react";
import { Link } from "react-router-dom";
import { FaHeart, FaCheck, FaRegHeart, FaPaperPlane, FaMapMarkerAlt, FaMoneyBillAlt, FaBriefcase } from "react-icons/fa";
import { saveJob, applyForJob } from "../services/api";

const JobCard = ({ job }) => {
  const [isSaved, setIsSaved] = useState(false);

  const handleSaveJob = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("You must be logged in to save a job");
      }

      await saveJob(job.id, token);
      setIsSaved(true);
      console.log("Job saved successfully!");
    } catch (error) {
      console.error("Save job error:", error);
      alert(error.message);
    }
  };

  const handleApply = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("You must be logged in to apply for a job");
      }

      const data = await applyForJob(job.id, token);
      console.log("Application submitted:", data);
      alert("Application submitted successfully!");
    } catch (error) {
      console.error("Apply for job error:", error);
      alert(error.message);
    }
  };

  return (
    <div className="card mb-4 shadow-sm hover-effect" style={{ border: "none", borderRadius: "12px", overflow: "hidden" }}>
      <div className="card-body p-4">
        <div className="d-flex justify-content-between align-items-center mb-3">
          <h5 className="card-title font-weight-bold mb-0" style={{ color: "#2c3e50" }}>{job.title}</h5>
          <button
            onClick={handleSaveJob}
            className={`btn btn-sm ${isSaved ? "btn-secondary" : "btn-outline-primary"}`}
            disabled={isSaved}
            style={{ borderRadius: "20px" }}
          >
            {isSaved ? (
              <>
                <FaCheck className="me-1" />
                Saved
              </>
            ) : (
              <>
                <FaRegHeart className="me-1" />
                Save
              </>
            )}
          </button>
        </div>

        <p className="card-text text-muted mb-3">{job.company_name}</p>

        <div className="d-flex align-items-center mb-3">
          <FaMapMarkerAlt className="me-2 text-muted" />
          <p className="mb-0 text-muted">{job.location}</p>
        </div>

        <div className="d-flex align-items-center mb-3">
          <FaMoneyBillAlt className="me-2 text-muted" />
          <p className="mb-0 text-muted">{job.salary}</p>
        </div>

        <div className="d-flex align-items-center mb-4">
          <FaBriefcase className="me-2 text-muted" />
          <p className="mb-0 text-muted">{job.employment_type}</p>
        </div>

        <div className="d-flex gap-2">
          <Link
            to={`/jobs/${job.id}`}
            className="btn btn-outline-primary flex-grow-1"
            style={{ borderRadius: "8px" }}
          >
            View Details
          </Link>
          <button
            onClick={handleApply}
            className="btn btn-primary flex-grow-1"
            style={{ borderRadius: "8px" }}
          >
            <FaPaperPlane className="me-2" />
            Apply
          </button>
        </div>
      </div>
    </div>
  );
};

export default JobCard;