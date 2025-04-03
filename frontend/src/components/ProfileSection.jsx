import React, { useState, useEffect } from "react";
import "../pages/Profile.css";

const ProfileSection = ({ username, email }) => {
  const [profilePic, setProfilePic] = useState(localStorage.getItem("profilePic") || "default-profile.png");
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState(""); 

  useEffect(() => {
    const storedPic = localStorage.getItem("profilePic");
    if (storedPic) {
      setProfilePic(storedPic);
    }
  }, []);

  const handleImageChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const imageUrl = e.target.result;
        setProfilePic(imageUrl);
        localStorage.setItem("profilePic", imageUrl);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDeleteImage = () => {
    setProfilePic("default-profile.png");
    localStorage.removeItem("profilePic");
  };

  const handleSavePassword = async () => {
    if (!oldPassword || !newPassword || !confirmPassword) {
      setMessage("Please fill all password fields.");
      return;
    }

    if (newPassword !== confirmPassword) {
      setMessage("New password and confirm password do not match.");
      return;
    }

    try {
      const response = await fetch("http://localhost:5000/api/change-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: email,
          oldPassword: oldPassword,
          newPassword: newPassword,
        }),
      });

      const data = await response.json();
      setMessage(data.message);
    } catch (error) {
      setMessage("Something went wrong. Try again.");
    }
  };

  return (
    <div className="profile-section">
      <div className="profile-content">
        <div className="profile-image">
          <img src={profilePic} alt="Profile" />
        </div>
        <div className="buttons">
          <input type="file" accept="image/*" onChange={handleImageChange} hidden id="fileInput" />
          <label htmlFor="fileInput" className="change-btn">Change Picture</label>
          <button className="delete-btn" onClick={handleDeleteImage}>Delete Picture</button>
        </div>
        
        <div className="input-group">
          <label>Name</label>
          <input type="text" value={username || "Loading..."} readOnly />
        </div>
        <div className="input-group">
          <label>Email</label>
          <input type="email" value={email || "Loading..."} readOnly />
        </div>
        <div className="input-group">
          <label>Old Password</label>
          <input type="password" placeholder="Enter Old Password" value={oldPassword} onChange={(e) => setOldPassword(e.target.value)} />
        </div>
        <div className="input-group">
          <label>New Password</label>
          <input type="password" placeholder="Enter new password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} />
        </div>
        <div className="input-group">
          <label>Confirm Password</label>
          <input type="password" placeholder="Confirm password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} />
        </div>
        
        <button className="save-btn" onClick={handleSavePassword}>Save Password</button>
        <button className="save-changes-btn">Save Changes</button>

        {message && <p style={{ color: "red" }}>{message}</p>}
      </div>
    </div>
  );
};

export default ProfileSection;
