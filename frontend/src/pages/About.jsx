// About.jsx
import React from "react";
import './About.css';
import { useNavigate } from "react-router-dom";

const About = () => {
  const navigate = useNavigate();

  return (
    <div className="course-container">
      <div className="course-content-wrapper">
        {/* Left Side Image Section */}
        <div className="image-section">
          <img src="/about-img.png" alt="About Us" className="course-image2" />
          <div className="back-button-container">
            <button className="back-button" onClick={() => navigate("/Dashboard")}>
              Back
            </button>
          </div>
        </div>

        {/* Right Side About Content */}
        <div className="course-details-section">
          <h1 className="course-title">Why Choose Us?</h1>
          <p className="course-description">
            We offer AI-powered solutions, expert guidance, and real-world projects to empower your learning.
            Our platform is designed for skill development, interview preparation, and hands-on practice.
            Join thousands of students who have already boosted their careers with us!
          </p>
          <button className="enroll-button" onClick={() => navigate("/courses")}>
            Our Courses
          </button>
        </div>
      </div>

      <hr style={{ margin: "60px 0", borderColor: "#ccc" }} />

      {/* Student Reviews Section */}
      <div className="reviews-section">
        <h2 className="reviews-title">Student's Reviews</h2>
        <div className="reviews-grid">
          {Array.from({ length: 6 }).map((_, index) => (
            <div key={index} className="review-card">
              <p className="review-text">
                Lorem ipsum dolor sit amet consectetur, adipisicing elit. Necessitatibus, suscipit a.
                Quibusdam, dignissimos consectetur. Sed ullam iusto eveniet qui aut quibusdam vero
                voluptate libero facilis fuga. Eligendi eaque molestiae modi?
              </p>
              <div className="reviewer-info">
                <img src={`/pic-${(index % 6) + 1}.jpg`} alt="Avatar" className="review-avatar" />
                <div>
                  <strong>John Deo</strong>
                  <div className="review-stars">⭐⭐⭐⭐⭐</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default About;
