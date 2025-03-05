import React from "react";
import { Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer"; 
import Home from "./pages/Home";
import Jobs from "./pages/Jobs";
import JobDetail from "./pages/JobDetail";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Profile from "./pages/Profile";
import SavedJobs from "./pages/SavedJobs";
import Applications from "./pages/Applications";
import ApplicationDetail from "./pages/ApplicationDetail";
import AdminDashboard from "./pages/AdminDashboard";
import CreateJob from "./pages/CreateJob";
import EditJob from "./pages/EditJob";


// import NotFound from "./pages/NotFound";

const App = () => {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Navbar (appears on all pages) */}
      <Navbar />

      {/* Main content area */}
      <main className="flex-grow container mx-auto p-4">
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Home />} />
          <Route path="/jobs" element={<Jobs />} />
          <Route path="/jobs/:id" element={<JobDetail />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* Protected Routes (User) */}
          <Route path="/profile" element={<Profile />} />
          <Route path="/saved-jobs" element={<SavedJobs />} />
          <Route path="/applications" element={<Applications />} />
          <Route path="/applications/:id" element={<ApplicationDetail />} />


          {/* Protected Routes (Admin) */}
          <Route path="/admin/dashboard" element={<AdminDashboard />} />
          <Route path="/admin/create-job" element={<CreateJob />} />
          <Route path="/admin/edit-job/:id" element={<EditJob />} />



          {/* 404 Not Found */}
          {/* <Route path="*" element={<NotFound />} /> */}
        </Routes>
      </main>

      {/* Footer (appears on all pages) */}
      <Footer />
    </div>
  );
};

export default App;