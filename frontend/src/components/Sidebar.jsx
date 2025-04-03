import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../pages/Profile.css";

const Sidebar = ({ setShowSettings, username }) => {
  const navigate = useNavigate();
  const [profilePic, setProfilePic] = useState(localStorage.getItem("profilePic") || "default-profile.png");

  useEffect(() => {
    const storedPic = localStorage.getItem("profilePic");
    if (storedPic) {
      setProfilePic(storedPic);
    }
  }, []);

  // Handle Settings State Persistence
  const handleOpenSettings = () => {
    localStorage.setItem("settingsOpen", "true"); // Store in localStorage
    setShowSettings(true);
  };

  const handleLogout = () => {
    localStorage.removeItem("userToken");
    localStorage.removeItem("userData");
    localStorage.removeItem("settingsOpen"); // Reset settings on logout
    navigate("/login");
  };

  return (
    <div className="sidebar">
      <div className="profile-header">
        <img src={profilePic} alt="Profile" className="profile-pic" />
        <h3>Welcome {username}</h3>
      </div>
      <ul className="menu">
        <li>📊 Dashboard</li>
        <li>📄 Courses</li>
        <li>📝 My Tests</li>
        <li>📄 My Results</li>
        <li onClick={handleOpenSettings}>⚙️ Settings</li>
      </ul>
      <button className="logout-btn" onClick={handleLogout}>Logout</button>
    </div>
  );
};

export default Sidebar;
