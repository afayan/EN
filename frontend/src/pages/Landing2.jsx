import { useState } from 'react';
import './Landing2.css';

export default function Landing2() {
  const [searchQuery, setSearchQuery] = useState('');
  
  return (
    <div className="container">
      <header>
        <div className="logo">EduNite</div>
        <nav>
          <ul>
            <li><a href="#">Home</a></li>
            <li><a href="#">About Us</a></li>
            <li><a href="#">Pages</a></li>
            <li><a href="#">Services</a></li>
            <li><a href="#">Courses</a></li>
            <li><a href="#">Blog</a></li>
          </ul>
        </nav>
        <a href="#" className="register-btn">Register</a>
      </header>

      <div className="lpcontainer">


      
      <div className="hero">
        <div className="hero-content">
          <h1 className="hero-title">
            Best Learning<br />
            Education Platform<br />
            <span className="text-highlight">in The World</span>
          </h1>
          <p className="hero-description">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit.
            Audax negotium, dicerem impudens, nisi hoc institut
            translatum ad philosophos nostros esset.
          </p>
          
          <div className="search-box">
            <input 
              type="text" 
              className="search-input" 
              placeholder="What do you want to learn"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <button className="search-btn">Search Course</button>
          </div>
        </div>
        
      </div>

     
      <div className="hero-images">
          <div className="image-1">
            <img src="/img1.jpg" alt="Students learning with laptop" />
          </div>
          <div className="image-2">
            <img src="/img2.jpg" alt="Library with students" />
          </div>
          <div className="benefits-card">
            <p><span className="check-icon">✓</span> Get 30% off on every 1st month</p>
            <p><span className="check-icon">✓</span> Expert teachers</p>
          </div>
        </div>    
        </div>    
    </div>
  );
}