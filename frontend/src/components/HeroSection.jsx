import React from "react";
import { Link } from "react-router-dom";
import "./HeroSection.css";

const HeroSection = () => {
  return (
    <section className="hero-section">
      <div className="shape shape-1"></div>
      <div className="shape shape-2"></div>
      
      <div className="hero-content">
        <div className="hero-text">
          <h1 className="hero-title">
            Empowering <span className="highlight">Education</span> For Everyone
          </h1>
          <p className="hero-description">
            Uniting learners and educators through innovative online platforms and cutting-edge educational technology. 
            Discover a new way to learn and grow with our comprehensive courses.
          </p>
          
          <div className="hero-cta">
            <Link to="/courses" className="btn btn-primary">Explore Courses</Link>
            <Link to="/about" className="btn btn-outline">Learn More</Link>
          </div>
          
          <div className="hero-stats">
            <div className="stat-item">
              <span className="stat-value">500+</span>
              <span className="stat-label">Courses</span>
            </div>
            <div className="stat-item">
              <span className="stat-value">50k+</span>
              <span className="stat-label">Students</span>
            </div>
            <div className="stat-item">
              <span className="stat-value">100+</span>
              <span className="stat-label">Instructors</span>
            </div>
          </div>
        </div>
        
        <div className="hero-image">
          <img src="/img1.jpg" alt="Students learning" className="main-image" />
          
          <div className="floating-card card-1">
            <div className="card-icon">✓</div>
            <div className="card-text">Expert Instructors</div>
          </div>
          
          <div className="floating-card card-2">
            <div className="card-icon">✓</div>
            <div className="card-text">Flexible Learning</div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
