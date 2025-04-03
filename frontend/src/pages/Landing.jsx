import './Landing.css'

import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "../components/Navbar.jsx";
import HeroSection from "../components/HeroSection.jsx";
// import AboutUs from "/pages/AboutUs.jsx";

function Landing() {
  return (
    <>
    <Navbar />
    <HeroSection/>
    </>
  );
}

export default Landing;