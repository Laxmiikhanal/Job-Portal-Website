import React, { useEffect, useState } from "react";
import { getSavedJobs } from "../services/api";
import JobCard from "../components/JobCard";

const SavedJobs = () => {
  const [savedJobs, setSavedJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchSavedJobs = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          throw new Error("You must be logged in to view saved jobs");
        }

        const data = await getSavedJobs(token);
        setSavedJobs(data.savedJobs);
      } catch (error) {
        console.error("Error fetching saved jobs:", error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchSavedJobs();
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

  if (savedJobs.length === 0) {
    return (
      <div className="container mx-auto p-4 text-center">
        <h1 className="text-3xl font-bold mb-4" style={{ color: "#2c3e50" }}>Saved Jobs</h1>
        <p className="text-muted">You have no saved jobs.</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-4" style={{ color: "#2c3e50" }}>Saved Jobs</h1>
      <div className="row row-cols-1 row-cols-md-2 row-cols-lg-3 g-4">
        {savedJobs.map((job) => (
          <div className="col" key={job.id}>
            <JobCard job={job} />
          </div>
        ))}
      </div>
    </div>
  );
};

export default SavedJobs;