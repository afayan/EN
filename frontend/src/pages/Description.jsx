import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom"; 
import "./Description.css";

const Description = () => {
  const [courseDetails, setCourseDetails] = useState({});
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { cid } = useParams(); // Get the course ID from URL

  useEffect(() => {
    const fetchCourseDetails = async () => {
      try {
        const userId = JSON.parse(sessionStorage.getItem("auth"))?._id;
        const response = await fetch(`/api/course-details/${cid}?userId=${userId}`);
        const data = await response.json();
        if (response.ok && data) {
          setCourseDetails(data);
        } else {
          console.error("Invalid course data received:", data.error);
        }
      } catch (error) {
        console.error("Error fetching course details:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCourseDetails();
  }, [cid]);

  const enroll = async () => {
    try {
      const userId = JSON.parse(sessionStorage.getItem("auth"))?._id;
      const response = await fetch("/api/enroll", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userid: userId, courseid: cid })
      });

      const data = await response.json();
      if (response.ok && courseDetails.videos && courseDetails.videos.length > 0) {
        const videoId = courseDetails.videos[0]._id || courseDetails.videos[0].id;
        navigate(`/video/${cid}/${videoId}`);
      } else {
        alert("Enrollment successful but no videos found.");
      }
    } catch (error) {
      console.error("Error enrolling in course:", error);
    }
  };

  if (loading) {
    return (
      <div className="course-container">
        <div className="bubbles">
          {Array.from({ length: 10 }).map((_, i) => (
            <div key={i} className="bubble"></div>
          ))}
        </div>
        <h1>Loading course details...</h1>
      </div>
    );
  }

  return (
    <div className="course-container">
      <div className="bubbles">
        {Array.from({ length: 10 }).map((_, i) => (
          <div key={i} className="bubble"></div>
        ))}
      </div>

      <div className="course-content-wrapper">
        {/* Left Side Image Section */}
        <div className="image-section">
          <img src="/coding bg1.jpg" alt="Course" className="course-image2" />
          <div className="back-button-container">
            <button className="back-button" onClick={() => navigate("/Dashboard")}>
              Back
            </button>
          </div>
        </div>

        {/* Right Side Content */}
        <div className="course-details-section">
          <h1 className="course-title">{courseDetails.name || "Course Name Unavailable"}</h1>
          <p className="course-description">
            {courseDetails.description || "No description available."}
          </p>
          
          <button className="enroll-button" onClick={enroll}>
            Enroll Now
          </button>
        </div>
      </div>
    </div>
  );
};

export default Description;
