import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaBars, FaTimes, FaUserAlt, FaBriefcase, FaBookmark, FaPaperclip, FaSignOutAlt } from "react-icons/fa"; // Import icons from react-icons/fa

const Navbar = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  // State to toggle the mobile menu
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleLogout = () => {
    // Remove the token from localStorage
    localStorage.removeItem("token");

    // Redirect to the login page
    navigate("/login");
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-dark shadow-lg" style={navbarStyle}>
      <div className="container-fluid">
        <Link className="navbar-brand" to="/">
          Job Portal
        </Link>

        {/* Hamburger Icon */}
        <button
          className="navbar-toggler"
          type="button"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          {/* Toggle icon based on menu state */}
          {isMenuOpen ? (
            <FaTimes size={30} color="white" />
          ) : (
            <FaBars size={30} color="white" />
          )}
        </button>

        {/* Navbar links */}
        <div className={`collapse navbar-collapse ${isMenuOpen ? "show" : ""}`} id="navbarNav">
          <ul className="navbar-nav ms-auto">
            <li className="nav-item">
              <Link className="nav-link text-white hover:text-yellow-400 transition-all" to="/jobs">
                <FaBriefcase className="me-2" /> Jobs
              </Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link text-white hover:text-yellow-400 transition-all" to="/saved-jobs">
                <FaBookmark className="me-2" /> Saved Jobs
              </Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link text-white hover:text-yellow-400 transition-all" to="/applications">
                <FaPaperclip className="me-2" /> My Applications
              </Link>
            </li>
            {token && (
              <li className="nav-item">
                <Link className="nav-link text-white hover:text-yellow-400 transition-all" to="/profile">
                  <FaUserAlt className="me-2" /> Profile
                </Link>
              </li>
            )}
            {token ? (
              <li className="nav-item">
                <button
                  onClick={handleLogout}
                  className="btn btn-outline-light rounded-full px-4 py-2 hover:bg-blue-600 transition-all"
                >
                  <FaSignOutAlt className="me-2" /> Logout
                </button>
              </li>
            ) : (
              <li className="nav-item">
                <Link
                  className="btn btn-outline-light rounded-full px-4 py-2 hover:bg-blue-600 transition-all"
                  to="/login"
                >
                  Login
                </Link>
              </li>
            )}
          </ul>
        </div>
      </div>
    </nav>
  );
};

const navbarStyle = {
  background: "linear-gradient(90deg, rgba(0, 123, 255, 1) 0%, rgba(36, 123, 160, 1) 100%)",
  transition: "background 0.3s ease-in-out",
};

export default Navbar;
