import React from "react";
import './About.css';
import { useNavigate } from "react-router-dom";

const Contact = () => {
  const navigate = useNavigate();

  return (
    <div className="course-container">
      <div className="course-content-wrapper">
        {/* Left Side Image Section */}
        <div className="image-section">
          <img src="/contact-img.png" alt="Contact Us" className="course-image2" />
          <div className="back-button-container">
            <button className="back-button" onClick={() => navigate("/Dashboard")}>
              Back
            </button>
          </div>
        </div>

        {/* Right Side Contact Form */}
        <div className="contact-form-section">
          <h2 className="contact-title">Get In Touch</h2>
          <form className="contact-form">
            <input type="text" placeholder="enter your name" required />
            <input type="email" placeholder="enter your email" required />
            <input type="tel" placeholder="enter your number" required />
            <textarea placeholder="enter your message" rows="4" required></textarea>
            <button type="submit" className="send-button">Send Message</button>
          </form>
        </div>
      </div>

      {/* Contact Info Boxes + Footer */}
      <div className="contact-extra-wrapper">
        <div className="info-boxes">
          <div className="info-box">
            <i className="fas fa-phone icon purple-icon"></i>
            <h3>Phone Number</h3>
            <p>123-456-7890</p>
            <p>111-222-3333</p>
          </div>
          <div className="info-box">
            <i className="fas fa-envelope icon purple-icon"></i>
            <h3>Email Address</h3>
            <p>dhanashree29@gmail.com</p>
            <p>vedant29@gmail.com</p>
          </div>
          <div className="info-box">
            <i className="fas fa-map-marker-alt icon purple-icon"></i>
            <h3>Office Address</h3>
            <p>A.P. Shah Institute of Technology , <br /> kasarwadavali, Thane(w) , <br/> india - 400615</p>
          </div>
        </div>

        <footer className="footer">
          <p>
            © copyright @ 2025 by <span> Team Edunite</span> | all rights reserved!
          </p>
        </footer>
      </div>
    </div>
  );
};

export default Contact;
