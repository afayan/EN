import React from "react";
import "../pages/AboutUs.css";

const Footer = () => {
  return (
    <footer className="footer">
      <p>Follow us on social media:</p>
      <div className="social-icons">
        <a href="https://www.instagram.com" target="_blank" rel="noopener noreferrer">
          <i className="fab fa-instagram"></i>
        </a>
        <a href="https://www.facebook.com" target="_blank" rel="noopener noreferrer">
          <i className="fab fa-facebook-f"></i>
        </a>
        <a href="https://www.twitter.com" target="_blank" rel="noopener noreferrer">
          <i className="fab fa-twitter"></i>
        </a>
        <a href="https://www.whatsapp.com" target="_blank" rel="noopener noreferrer">
          <i className="fab fa-whatsapp"></i>
        </a>
      </div>
      <p>&copy; 2024 EduNite. All rights reserved.</p>
    </footer>
  );
};

export default Footer;
