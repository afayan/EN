import React from "react";
import "../pages/AboutUs.css";

const AboutUsContent = () => {
  return (
    <div className="about-us-section" id="about">
      <h2>About Us</h2>
      <p>
        Welcome to EduNite, your all-in-one platform for skill development and learning.
        Our goal is to provide students with multiple courses, AI-powered chatbots, security features,
        student activity monitoring, and customized tests based on selected courses.
      </p>

      <div className="info-boxes">
        <div className="info-box">
          <h3>Who We Are</h3>
          <p>
            We are a team passionate about education, combining AI and technology to enhance the learning experience.
          </p>
        </div>
        <div className="info-box">
          <h3>What We Do</h3>
          <p>
            We offer a variety of courses, AI-assisted tutoring, skill assessments, and real-time student progress tracking.
          </p>
        </div>
        <div className="info-box">
          <h3>Why Choose EduNite?</h3>
          <ul>
            <li>AI-Powered Learning: Personalized course recommendations.</li>
            <li>Skill-Based Testing: Custom quizzes based on learning progress.</li>
            <li>Interactive Chatbot: Instant support and guidance.</li>
            <li>Student Monitoring: Insights into learning habits and improvements.</li>
          </ul>
        </div>
        <div className="info-box">
          <h3>Our Mission</h3>
          <p>
            We aim to revolutionize education with AI-driven insights, making learning more interactive, engaging, and accessible.
          </p>
        </div>
      </div>
    </div>
  );
};

export default AboutUsContent;
