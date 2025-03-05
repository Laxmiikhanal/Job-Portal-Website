const API_BASE_URL = "http://localhost:8000/api/v1";

// Login user
export const login = async (email, password) => {
  try {
    const response = await fetch(`${API_BASE_URL}/auth/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Login failed");
    }

    return response.json();
  } catch (error) {
    console.error("Login error:", error);
    throw error;
  }
};

// Register user
export const register = async (formData) => {
  try {
    const response = await fetch(`${API_BASE_URL}/auth/register`, {
      method: "POST",
      body: formData, // Send FormData directly (no headers needed for FormData)
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Registration failed");
    }

    return response.json();
  } catch (error) {
    console.error("Registration error:", error);
    throw error;
  }
};

// Get user profile
export const getProfile = async (token) => {
  try {
    const response = await fetch(`${API_BASE_URL}/auth/me`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Failed to fetch profile");
    }

    return response.json();
  } catch (error) {
    console.error("Fetch profile error:", error);
    throw error;
  }
};

// Fetch all jobs
export const allJobs = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/jobs`);
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Failed to fetch jobs");
    }
    return response.json();
  } catch (error) {
    console.error("Fetch jobs error:", error);
    throw error;
  }
};

// Fetch a single job by ID
export const getJob = async (id) => {
  try {
    const response = await fetch(`${API_BASE_URL}/job/${id}`);

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Failed to fetch job details");
    }

    return response.json();
  } catch (error) {
    console.error("Fetch job error:", error);
    throw error;
  }
};

// Save a job for the logged-in user
export const saveJob = async (jobId, token) => {
  try {
    const response = await fetch(`${API_BASE_URL}/job/save/${jobId}`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json", // Ensure the content type is set
      },
    });

    // Check if the response is OK (status code 200-299)
    if (!response.ok) {
      // Parse the error response from the backend
      const errorData = await response.json();
      throw new Error(errorData.message || "Failed to save job");
    }

    // Parse the success response
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Save job error:", error);

    // Rethrow the error with a user-friendly message
    throw new Error(error.message || "An error occurred while saving the job");
  }
};
// Fetch all saved jobs for the logged-in user
export const getSavedJobs = async (token) => {
  try {
    const response = await fetch(`${API_BASE_URL}/user/saved-jobs`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Failed to fetch saved jobs");
    }

    return response.json();
  } catch (error) {
    console.error("Fetch saved jobs error:", error);
    throw error;
  }
};

// Create a new application
export const applyForJob = async (jobId, token) => {
  try {
    if (!token) {
      throw new Error("You must be logged in to apply for a job");
    }

    const response = await fetch(`${API_BASE_URL}/createApplication/${jobId}`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Failed to apply for the job");
    }

    return response.json();
  } catch (error) {
    console.error("Apply for job error:", error);
    throw error;
  }
};

// Fetch all applications for the logged-in user
export const getApplications = async (token) => {
  try {
    if (!token) {
      throw new Error("You must be logged in to fetch applications");
    }

    const response = await fetch(`${API_BASE_URL}/user/applications`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Failed to fetch applications");
    }

    return response.json();
  } catch (error) {
    console.error("Fetch applications error:", error);
    throw error;
  }
};

// Fetch a single application by ID
export const getApplication = async (applicationId, token) => {
  try {
    if (!token) {
      throw new Error("You must be logged in to fetch application details");
    }

    const response = await fetch(`${API_BASE_URL}/singleApplication/${applicationId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Failed to fetch application details");
    }

    return response.json();
  } catch (error) {
    console.error("Fetch application error:", error);
    throw error;
  }
};

// Delete an application
export const deleteApplication = async (applicationId, token) => {
  try {
    if (!token) {
      throw new Error("You must be logged in to delete an application");
    }

    const response = await fetch(`${API_BASE_URL}/deleteApplication/${applicationId}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Failed to delete application");
    }

    return response.json();
  } catch (error) {
    console.error("Delete application error:", error);
    throw error;
  }
};
// Fetch all jobs (admin only)
export const getAllJobs = async (token) => {
  try {
    const response = await fetch(`${API_BASE_URL}/admin/allJobs`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Failed to fetch jobs");
    }

    return response.json();
  } catch (error) {
    console.error("Fetch jobs error:", error);
    throw error;
  }
};

// Fetch all users (admin only)
export const getAllUsers = async (token) => {
  try {
    const response = await fetch(`${API_BASE_URL}/admin/allUsers`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Failed to fetch users");
    }

    return response.json();
  } catch (error) {
    console.error("Fetch users error:", error);
    throw error;
  }
};

// Fetch all applications (admin only)
export const getAllApplications = async (token) => {
  try {
    const response = await fetch(`${API_BASE_URL}/admin/allApplications`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Failed to fetch applications");
    }

    return response.json();
  } catch (error) {
    console.error("Fetch applications error:", error);
    throw error;
  }
};

// Update application status (admin only)
export const updateApplicationStatus = async (applicationId, status, token) => {
  try {
    const response = await fetch(`${API_BASE_URL}/admin/updateApplication/${applicationId}`, {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ status }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Failed to update application status");
    }

    return response.json();
  } catch (error) {
    console.error("Update application status error:", error);
    throw error;
  }
};

// Delete application (admin only)
export const deleteApplicationAdmin = async (applicationId, token) => {
  try {
    const response = await fetch(`${API_BASE_URL}/admin/deleteApplication/${applicationId}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Failed to delete application");
    }

    return response.json();
  } catch (error) {
    console.error("Delete application error:", error);
    throw error;
  }
};

// Update user role (admin only)
export const updateUserRole = async (userId, role, token) => {
  try {
    const response = await fetch(`${API_BASE_URL}/admin/updateUser/${userId}`, {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ role }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Failed to update user role");
    }

    return response.json();
  } catch (error) {
    console.error("Update user role error:", error);
    throw error;
  }
};

// Delete user (admin only)
export const deleteUser = async (userId, token) => {
  try {
    const response = await fetch(`${API_BASE_URL}/admin/deleteUser/${userId}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Failed to delete user");
    }

    return response.json();
  } catch (error) {
    console.error("Delete user error:", error);
    throw error;
  }
};
// Create a new job (admin only)
export const createJob = async (formData, token) => {
  const response = await fetch(`${API_BASE_URL}/job/create`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: formData,
  });

  if (!response.ok) {
    throw new Error("Failed to create job");
  }

  return response.json();
};

export const getJobById = async (id, token) => {
  try {
    if (!id) throw new Error("Job ID is required");
    
    const response = await fetch(`http://localhost:8000/api/v1/admin/getJob/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Failed to fetch job");
    }

    return response.json();
  } catch (error) {
    console.error("Fetch job error:", error);
    throw error;
  }
};


// Update a job (admin only)
export const updateJob = async (jobId, jobData, token) => {
  try {
    if (!jobId) throw new Error("Job ID is required");
    const response = await fetch(`${API_BASE_URL}/admin/updateJob/${jobId}`, {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(jobData),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Failed to update job");
    }

    return response.json();
  } catch (error) {
    console.error("Update job error:", error);
    throw error;
  }
};
// Delete a job (admin only)
export const deleteJob = async (jobId, token) => {
  try {
    const response = await fetch(`${API_BASE_URL}/admin/deleteJob/${jobId}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Failed to delete job");
    }

    return response.json();
  } catch (error) {
    console.error("Delete job error:", error);
    throw error;
  }
};