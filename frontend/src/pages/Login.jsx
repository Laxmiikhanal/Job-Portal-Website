import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { login, getProfile } from "../services/api";
import { FaSignInAlt, FaEnvelope, FaLock } from "react-icons/fa";
import { Spinner } from "react-bootstrap"; // Adding Spinner for loading state

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false); // For loading state
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    if (!email || !password) {
      setError("Please fill in all fields.");
      return;
    }

    setLoading(true); // Start loading
    setError(""); // Reset error

    try {
      const loginData = await login(email, password);

      if (loginData.success) {
        localStorage.setItem("token", loginData.token);

        const profileData = await getProfile(loginData.token);

        if (profileData.user.role === "admin") {
          navigate("/admin/dashboard");
        } else {
          navigate("/profile");
        }
      } else {
        setError(loginData.message || "Login failed. Please try again.");
      }
    } catch (err) {
      console.error("Login error:", err);
      setError(err.message || "An error occurred. Please try again.");
    } finally {
      setLoading(false); // Stop loading
    }
  };

  return (
    <div className="min-vh-100 d-flex justify-content-center align-items-center bg-light">
      <div className="bg-white p-5 rounded shadow-sm w-100" style={{ maxWidth: "400px" }}>
        <h2 className="text-center mb-4">
          <FaSignInAlt className="mr-2" />
          Login
        </h2>
        
        {error && (
          <div className="alert alert-danger mb-4 p-2">
            {error}
          </div>
        )}

        <form onSubmit={handleLogin}>
          <div className="mb-3">
            <label htmlFor="email" className="form-label">
              <FaEnvelope className="mr-2" />
              Email
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="form-control"
              required
            />
          </div>

          <div className="mb-4">
            <label htmlFor="password" className="form-label">
              <FaLock className="mr-2" />
              Password
            </label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="form-control"
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="btn btn-primary w-100"
          >
            {loading ? (
              <Spinner animation="border" variant="light" size="sm" />
            ) : (
              "Login"
            )}
          </button>
        </form>

        <div className="mt-3 text-center">
          <p className="mb-0">Don't have an account?</p>
          <a href="/register" className="text-primary">Sign up here</a>
        </div>
      </div>
    </div>
  );
};

export default Login;
