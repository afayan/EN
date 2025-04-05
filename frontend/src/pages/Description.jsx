import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom"; 
import "./Description.css";

const CoursePage = () => {
  const [course, setCourse] = useState({});
  const navigate = useNavigate();
  const { id } = useParams(); // Get the course ID from URL

  useEffect(() => {
    const fetchCourse = async () => {
      try {
        const response = await fetch(`/api/course/${id}`);
        const data = await response.json();
        console.log("Fetched data:", data);
  
        if (response.ok && data) {
          setCourse(data);
        } else {
          console.error("Invalid course data received.");
        }
      } catch (error) {
        console.error("Error fetching course:", error);
      }
    };
  
    if (id) {
      fetchCourse();
    }
  }, [id]);
  





  

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

      // After enrolling, navigate to the course page
      navigate(`/course/${id}`);
    } catch (error) {
      console.error("Error enrolling in course:", error);
    }
  };

  
  return (
    <div className="course-container">
      <div className="bubbles">
        {Array.from({ length: 10 }).map((_, i) => (
          <div key={i} className="bubble"></div>
        ))}
      </div>


      <h1 className="course-title">{course.cname || "Loading..."}</h1>

   
      <p className="course-description">
        {course.description || "Loading description..."}
      </p>

      {/* Enroll Now Button */}
      <button className="enroll-button" onClick={enroll}>
  Enroll Now
</button>


      {/* Back Button */}
      <div className="back-button-container">
        <button className="back-button" onClick={() => navigate("/Dashboard")}>
          Back
        </button>
      </div>
    </div>
  );
};

export default CoursePage;
