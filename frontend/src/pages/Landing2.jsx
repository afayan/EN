import { useState } from 'react';
import './Landing2.css';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import HeroSection from '../components/HeroSection';

export default function Landing2() {
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate()
  
  return (
    <div className="app-container">
      <Navbar />
      <HeroSection />
      
      <div className="search-container">
        <div className="container">
          <h2 className="section-title">Find Your Perfect Course</h2>
          <div className="search-box">
            <input 
              type="text" 
              className="search-input" 
              placeholder="What do you want to learn?"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <button className="search-btn">Search Course</button>
          </div>
        </div>
      </div>    
    </div>
  );
}