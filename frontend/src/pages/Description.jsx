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
        // Get user ID from session storage
        console.log('fetching details');
        

        const userId = JSON.parse(sessionStorage.getItem("auth"))?._id;

        console.log(cid, userId);
        
        
        // Fetch course details with user ID as query parameter
        const response = await fetch(`/api/course-details/${cid}?userId=${userId}`);
        const data = await response.json();
        console.log("Fetched course details:", data);
  
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
  
    // if (id) {
    //   fetchCourseDetails();
    // }

    fetchCourseDetails()
  }, [cid]);
  
  // Enroll function
  const enroll = async () => {
    try {
      const response = await fetch("/api/enroll", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          userid: JSON.parse(sessionStorage.getItem("auth"))._id,
          courseid: id
        })
      });

      const data = await response.json();
      console.log("Enroll Response:", data);

      // After successful enrollment, refresh the page to update the course details
      if (response.ok) {
        // Refresh course details
        window.location.reload();
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

      <h1 className="course-title">{courseDetails.name || "Course Name Unavailable"}</h1>

      <div className="course-info">
        <p><strong>Category:</strong> {courseDetails.category}</p>
        <p><strong>Faculty:</strong> {courseDetails.faculty}</p>
        <p><strong>Created by:</strong> {courseDetails.creator || "Unknown"}</p>
        <p><strong>Created on:</strong> {new Date(courseDetails.createdDate).toLocaleDateString()}</p>
      </div>
      
      <div className="course-stats">
        <p><strong>Students Enrolled:</strong> {courseDetails.enrollmentCount}</p>
        <p><strong>Total Videos:</strong> {courseDetails.videoCount}</p>
      </div>
   
      <p className="course-description">
        {courseDetails.description || "No description available."}
      </p>

      {/* Conditional rendering for Enroll/View Content button */}
      {courseDetails.isEnrolled ? (
        <div className="enrolled-content">
          <h2>Course Content</h2>
          {courseDetails.videos && courseDetails.videos.length > 0 ? (
            <ul className="video-list">
              {courseDetails.videos.map(video => (
                <li key={video.id} className="video-item">
                  <h3>{video.title}</h3>
                  <p>{video.description}</p>
                  <a href={video.videoUrl} target="_blank" rel="noopener noreferrer" className="watch-button">
                    Watch Video
                  </a>
                </li>
              ))}
            </ul>
          ) : (
            <p>No videos available for this course yet.</p>
          )}
        </div>
      ) : (
        <button className="enroll-button" onClick={enroll}>
          Enroll Now
        </button>
      )}

      {/* Back Button */}
      <div className="back-button-container">
        <button className="back-button" onClick={() => navigate("/Dashboard")}>
          Back
        </button>
      </div>
    </div>
  );
};

export default Description;