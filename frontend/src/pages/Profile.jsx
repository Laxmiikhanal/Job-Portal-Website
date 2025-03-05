import React, { useEffect, useState } from "react";
import { getProfile } from "../services/api";
import { Spinner } from "react-bootstrap"; // Bootstrap spinner for loading state
import { FaDownload, FaUserCircle } from "react-icons/fa"; // Icons for download and user

const Profile = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          throw new Error("No token found");
        }

        // Fetch profile data
        const data = await getProfile(token);

        if (data.success) {
          setUser(data.user);
        } else {
          setError(data.message || "Failed to load profile data.");
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  if (loading) {
    return (
      <div className="text-center mt-8">
        <Spinner animation="border" variant="primary" />
        <p>Loading...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center mt-8 text-danger">
        <p>{error}</p>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="text-center mt-8">
        <p>No profile data available.</p>
      </div>
    );
  }

  return (
    <div className="min-vh-100 bg-light py-5">
      <div className="container">
        <div className="card shadow-lg mx-auto" style={{ maxWidth: "600px" }}>
          <div className="card-body">
            <div className="text-center mb-4">
              <div className="avatar mb-3">
                {user.avatar_url ? (
                  <img
                    src={user.avatar_url}
                    alt="Avatar"
                    className="rounded-circle"
                    style={{ width: "150px", height: "150px", objectFit: "cover" }}
                  />
                ) : (
                  <FaUserCircle size={150} className="text-muted" />
                )}
              </div>
              <h2 className="card-title">{user.name}</h2>
              <p className="text-muted">{user.email}</p>
            </div>
            <div className="mb-3">
              <h5>Profile Details</h5>
              <ul className="list-unstyled">
                <li><strong>Role:</strong> {user.role}</li>
                <li>
                  <strong>Skills:</strong> 
                  {Array.isArray(user.skills) ? user.skills.join(", ") : user.skills}
                </li>
              </ul>
            </div>
            {user.resume_url && (
              <div className="mt-3">
                <h5>Resume</h5>
                <a
                  href={user.resume_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-outline-primary btn-sm"
                >
                  <FaDownload className="mr-2" /> Download Resume
                </a>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
