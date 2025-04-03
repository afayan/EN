import React from "react";
import Navbar from "../components/Navbar"; 
import HeroSection from "../components/HeroSection";
import AboutUsContent from "../components/AboutUsContent";
import ContactUs from "../components/ContactUs";
import Footer from "../components/Footer";
import "./AboutUs.css";

const AboutUs = () => {
  return (
    <>
      <Navbar />
      <HeroSection />
      <AboutUsContent />
      <ContactUs />
      <Footer />
    </>
  );
};

export default AboutUs;