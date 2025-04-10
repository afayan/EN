import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./Navbar.css";
import useLogin from "../hooks/useLogin";
import { Menu, X } from "lucide-react";

const Navbar = () => {
  const [loading, userid, islogged] = useLogin();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const navigate = useNavigate();

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <nav className={`modern-nav ${isScrolled ? 'scrolled' : ''}`}>
      <div className="nav-container">
        <div className="logo">
          <Link to="/">EduNite</Link>
        </div>
        
        <div className={`menu-container ${isMobileMenuOpen ? 'active' : ''}`}>
          <div className="menu">
            <Link to="/dashboard">Dashboard</Link>
            <Link to="/courses">Courses</Link>
            <Link to="/about">About Us</Link>
            <Link to="/contact">Contact</Link>
          </div>
          
          <div className="auth-buttons">
            {!loading && islogged && (
              <Link to="/profile" className="btn-primary">My Profile</Link>
            )}
            {!loading && !islogged && (
              <>
                <Link to="/login" className="btn-outline">Login</Link>
                <Link to="/login" className="btn-primary">Sign Up</Link>
              </>
            )}
          </div>
        </div>
        
        <div className="mobile-menu-toggle" onClick={toggleMobileMenu}>
          {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
