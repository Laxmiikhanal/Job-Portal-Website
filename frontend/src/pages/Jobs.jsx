import React, { useEffect, useState } from "react";
import { allJobs } from "../services/api";
import JobCard from "../components/JobCard";
import { Form, Row, Col, Pagination } from "react-bootstrap";

const Jobs = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [filters, setFilters] = useState({
    location: "",
    employmentType: "",
    salaryRange: "",
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [jobsPerPage] = useState(6); // Number of jobs per page

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const response = await allJobs();
        if (response.success) {
          setJobs(response.jobs); // Access the `jobs` array from the response
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

  // Filter and search jobs
  const filteredJobs = jobs.filter((job) => {
    const matchesSearch = job.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          job.company_name.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesLocation = filters.location ? job.location === filters.location : true;
    const matchesEmploymentType = filters.employmentType ? job.employment_type === filters.employmentType : true;
    const matchesSalaryRange = filters.salaryRange ? job.salary === filters.salaryRange : true;

    return matchesSearch && matchesLocation && matchesEmploymentType && matchesSalaryRange;
  });

  // Pagination logic
  const indexOfLastJob = currentPage * jobsPerPage;
  const indexOfFirstJob = indexOfLastJob - jobsPerPage;
  const currentJobs = filteredJobs.slice(indexOfFirstJob, indexOfLastJob);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

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
    <div className="container-fluid mt-5">
      <div className="row">
        {/* Sidebar Filter Section */}
        <div className="col-md-3">
          <div className="p-4" style={{ borderRight: "1px solid #e0e0e0" }}>
            <h4 className="mb-4" style={{ color: "#2c3e50", fontWeight: "bold" }}>Filters</h4>

            {/* Location Filter */}
            <Form.Group className="mb-4">
              <Form.Label style={{ color: "#7f8c8d" }}>Location</Form.Label>
              <Form.Select
                value={filters.location}
                onChange={(e) => setFilters({ ...filters, location: e.target.value })}
                style={{ borderRadius: "8px", border: "1px solid #bdc3c7" }}
              >
                <option value="">All Locations</option>
                <option value="Kathmandu">Kathmandu</option>
                <option value="New York">New York</option>
                <option value="London">London</option>
                {/* Add more locations as needed */}
              </Form.Select>
            </Form.Group>

            {/* Employment Type Filter */}
            <Form.Group className="mb-4">
              <Form.Label style={{ color: "#7f8c8d" }}>Employment Type</Form.Label>
              <Form.Select
                value={filters.employmentType}
                onChange={(e) => setFilters({ ...filters, employmentType: e.target.value })}
                style={{ borderRadius: "8px", border: "1px solid #bdc3c7" }}
              >
                <option value="">All Types</option>
                <option value="Full-time">Full-time</option>
                <option value="Part-time">Part-time</option>
                <option value="Freelance">Freelance</option>
                {/* Add more employment types as needed */}
              </Form.Select>
            </Form.Group>

            {/* Salary Range Filter */}
            <Form.Group className="mb-4">
              <Form.Label style={{ color: "#7f8c8d" }}>Salary Range</Form.Label>
              <Form.Select
                value={filters.salaryRange}
                onChange={(e) => setFilters({ ...filters, salaryRange: e.target.value })}
                style={{ borderRadius: "8px", border: "1px solid #bdc3c7" }}
              >
                <option value="">All Salaries</option>
                <option value="Under $20,000">Under $20,000</option>
                <option value="$20,000 - $50,000">$20,000 - $50,000</option>
                <option value="$50,000 - $100,000">$50,000 - $100,000</option>
                {/* Add more salary ranges as needed */}
              </Form.Select>
            </Form.Group>
          </div>
        </div>

        {/* Job Listings Section */}
        <div className="col-md-9">
          <div className="p-4">
            {/* Hero Section */}
            <div className="text-center mb-5">
              <h1 className="display-4 font-weight-bold" style={{ color: "#2c3e50" }}>
                Find Your Dream Job
              </h1>
              <p className="lead mb-4" style={{ color: "#7f8c8d", fontSize: "1.2rem" }}>
                Explore the best job opportunities available right now.
              </p>
            </div>

            {/* Search Bar */}
            <Form.Group className="mb-5">
              <Form.Control
                type="text"
                placeholder="Search by job title or company"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                style={{ borderRadius: "8px", border: "1px solid #bdc3c7" }}
              />
            </Form.Group>

            {/* Job Listings */}
            <div className="row row-cols-1 row-cols-md-2 row-cols-lg-3 g-4">
              {currentJobs.map((job) => (
                <div className="col" key={job.id}>
                  <JobCard job={job} />
                </div>
              ))}
            </div>

            {/* Pagination */}
            <div className="d-flex justify-content-center mt-5">
              <Pagination>
                {[...Array(Math.ceil(filteredJobs.length / jobsPerPage)).keys()].map((number) => (
                  <Pagination.Item
                    key={number + 1}
                    active={number + 1 === currentPage}
                    onClick={() => paginate(number + 1)}
                    style={{
                      margin: "0 4px",
                      borderRadius: "8px",
                      border: "1px solid #bdc3c7",
                      color: number + 1 === currentPage ? "#fff" : "#2c3e50",
                      backgroundColor: number + 1 === currentPage ? "#3498db" : "transparent",
                    }}
                  >
                    {number + 1}
                  </Pagination.Item>
                ))}
              </Pagination>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Jobs;