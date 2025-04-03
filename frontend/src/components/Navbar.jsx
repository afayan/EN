import React from "react";
import { Link } from "react-router-dom"; // Importing Link for navigation
import "../pages/Landing.css";
import useLogin from "../hooks/useLogin";

const Navbar = () => {

  const [loading, userid, islogged] = useLogin()

  return (
    <nav>
      <div className="logo">
        <Link to="/">Empowering Education</Link>
      </div>
      <div className="menu">
        <Link to="/about">About Us</Link>
        {!loading && islogged &&<Link to="/profile">Profile</Link>}
        {!loading && !islogged && <Link to="/login">Login</Link>}
       {!loading && !islogged && <Link to="/login">Signup</Link>}
      </div>
    </nav>
  );
};

export default Navbar;
