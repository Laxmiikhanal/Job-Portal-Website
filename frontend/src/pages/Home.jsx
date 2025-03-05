import React, { useEffect, useState } from "react";
import { allJobs } from "../services/api";
import { Link } from "react-router-dom";
import { FaMapMarkerAlt, FaMoneyBillAlt, FaBriefcase } from "react-icons/fa"; // Icons for job details

const Home = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const response = await allJobs();
        if (response.success) {
          setJobs(response.jobs.slice(0, 6)); // Display the first 6 jobs
        } else {
          setError("Failed to fetch jobs");
        }
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchJobs();
  }, []);

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

  return (
    <div
      style={{
        background: "linear-gradient(to bottom right, #f8fafc, #e0e7ff)", // Gradient background for the whole page
        minHeight: "100vh",
      }}
    >
      {/* Hero Section */}
      <section
        className="hero-section text-center py-5"
        style={{
          background: "linear-gradient(to right, #4f46e5, #818cf8)",
          width: "100%",
        }}
      >
        <div className="container">
          <h1 className="display-4 text-white mb-4">Find Your Dream Job Today!</h1>
          <p className="lead text-white mb-4">Join thousands of companies and job seekers on our platform.</p>
          <Link to="/jobs" className="btn btn-light btn-lg px-5 py-2">
            Browse Jobs
          </Link>
        </div>
      </section>

      {/* Featured Jobs Section */}
      <section className="featured-jobs-section py-5" style={{ width: "100%" }}>
        <div className="container">
          <h2 className="text-center mb-4 text-primary font-weight-bold">Featured Jobs</h2>
          <div className="row row-cols-1 row-cols-md-2 row-cols-lg-3 g-4">
            {jobs.map((job) => (
              <div className="col mb-4" key={job.id}>
                <div className="card h-100 shadow-sm border-0 hover-effect">
                  <div className="card-body">
                    <h5 className="card-title font-weight-bold">{job.title}</h5>
                    <p className="card-text text-muted">{job.company_name}</p>
                    <div className="d-flex align-items-center mb-2">
                      <FaMapMarkerAlt className="me-2 text-muted" />
                      <p className="card-text mb-0">{job.location}</p>
                    </div>
                    <div className="d-flex align-items-center mb-2">
                      <FaMoneyBillAlt className="me-2 text-muted" />
                      <p className="card-text mb-0">{job.salary}</p>
                    </div>
                    <div className="d-flex align-items-center mb-3">
                      <FaBriefcase className="me-2 text-muted" />
                      <p className="card-text mb-0">{job.employment_type}</p>
                    </div>
                    <div className="d-flex justify-content-between">
                      <Link to={`/jobs/${job.id}`} className="btn btn-primary btn-sm">
                        View Details
                      </Link>
                      <button className="btn btn-success btn-sm">Apply</button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="text-center mt-4">
            <Link to="/jobs" className="btn btn-outline-primary btn-lg px-5 py-2">
              View All Jobs
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer
        className="bg-dark text-white text-center py-4"
        style={{ width: "100%" }}
      >
        <div className="container">
          <p>&copy; 2025 Job Portal | All Rights Reserved</p>
          <p>
            <Link to="/contact" className="text-white">Contact Us</Link> | 
            <Link to="/terms" className="text-white"> Terms of Service</Link>
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Home;