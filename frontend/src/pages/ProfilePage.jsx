import React, { useState, useEffect } from "react";
import Sidebar from "../components/Sidebar"; 
import ProfileSection from "../components/ProfileSection";
import "./Profile.css";  

const ProfilePage = () => {  
  const [profilePic, setProfilePic] = useState("https://via.placeholder.com/80");
  const [showSettings, setShowSettings] = useState(false);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const fetchUserData = async () => {
      const token = JSON.parse(sessionStorage.getItem("auth")); 
      if (!token || !token.email) {
        console.error("No user token found");
        return;
      }

      try {
        const response = await fetch(`/api/get-user?email=${token.email}`);
        const data = await response.json();
        if (data.status) {
          setUser(data.user);
        } else {
          console.error("Error fetching user:", data.message);
        }
      } catch (error) {
        console.error("Fetch error:", error);
      }
    };

    fetchUserData();
  }, []);

  useEffect(() => {
    // Get the settings state from localStorage
    const storedSettingsState = localStorage.getItem("settingsOpen");
    if (storedSettingsState === "true") {
      setShowSettings(true);
    }
  }, []);

  const handleImageChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setProfilePic(imageUrl);
    }
  };

  const handleDeleteImage = () => {
    setProfilePic("https://via.placeholder.com/80");
  };

  return (
    <div className="settings-container">
      <Sidebar 
        profilePic={profilePic} 
        setShowSettings={setShowSettings} 
        username={user ? user.username : "Loading..."} 
      />

     {showSettings && (
      <ProfileSection 
        profilePic={profilePic} 
        handleImageChange={handleImageChange} 
        handleDeleteImage={handleDeleteImage}
        username={user?.username || "Loading..."}  // Pass username
        email={user?.email || "Loading..."}  // Pass email
      />
    )}
    </div>
  );
};

export default ProfilePage;
