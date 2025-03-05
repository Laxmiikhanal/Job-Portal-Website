import React from "react";
import { Link } from "react-router-dom";
import { FaEye, FaTrash } from "react-icons/fa";  // Using react-icons for better visual appeal

const ApplicationCard = ({ application, onDelete }) => {
  const { id, job_title, company_name, status } = application;

  return (
    <div className="card shadow-lg p-4 mb-4 rounded-lg" style={{ backgroundColor: "#f8f9fa" }}>
      <div className="card-body">
        <h5 className="card-title text-primary">{job_title}</h5>
        <p className="card-text text-muted"><strong>Company:</strong> {company_name}</p>
        <p className="card-text text-success"><strong>Status:</strong> {status}</p>
        <div className="d-flex justify-content-between align-items-center mt-3">
          <Link
            to={`/applications/${id}`}
            className="btn btn-outline-primary btn-sm d-flex align-items-center"
          >
            <FaEye className="mr-2" /> View Details
          </Link>
          <button
            onClick={() => onDelete(id)}
            className="btn btn-outline-danger btn-sm d-flex align-items-center"
          >
            <FaTrash className="mr-2" /> Delete
          </button>
        </div>
      </div>
    </div>
  );
};

export default ApplicationCard;
