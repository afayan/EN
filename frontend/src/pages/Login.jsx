import React, { useRef, useState } from "react";
import gsap from 'gsap'
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";

function Login() {
  const [error, setError] = useState(false);
  const [success, setSuccess] = useState(false);
  const [loading, setloading] = useState(false);
  const [showlogin, setShowLogin] = useState(true)
  const navigate = useNavigate()

  const loginemail = useRef();
  const loginpassword = useRef();
  const passwordref = useRef();
  const usernameref = useRef();
  const emailref = useRef();
  const repeatpasswordref = useRef();

  async function handleSignup() {
    setError("");
    setSuccess("");

    let password = passwordref.current.value;
    let username = usernameref.current.value.trim();
    let email = emailref.current.value.trim();
    let repeat_password = repeatpasswordref.current.value;

    if (!password || !username || !email || !repeat_password) {
      setError("Please fill all fields");
      return;
    }

    if (password != repeat_password) {
      setError("Passwords do not match");
      return;
    }

    setloading(true);

    const response = await fetch("/api/signup", {
      method: "post",
      headers: {
        "Content-type": "application/json",
      },
      body: JSON.stringify({
        username: username,
        email: email,
        password: password,
      }),
    });

    const data = await response.json();

    setloading(false);

    if (data.status) {
      //true
      setSuccess(data.message);
      
    } else {
      setError(data.message);
    }
  }

  async function handleLogin() {

    setSuccess('')
    setError('')

    let email = loginemail.current.value;
    let password = loginpassword.current.value;

    if (!email || !password) {
      setError("Please fill all fields");
      return;
    }

    setloading(true);

    const reponse = await fetch("/api/login", {
      method: "post",
      headers: {
        "Content-type": "application/json",
      },
      body: JSON.stringify({
        email: email,
        password: password,
      }),
    });

    const data = await reponse.json();

    setloading(false);

    if (data.status) {
      //true
      setSuccess(data.message);
      
      sessionStorage.setItem('auth', JSON.stringify(data.user)); // Store user details instead of just token
      console.log(sessionStorage.getItem('auth'));

      navigate('/dashboard')

    } else {
      setError(data.message);
    }
  }

  function openlogin() {

    if (showlogin) {
      return
    }

    setShowLogin(true)
    setError('')
    setSuccess('')

    gsap.to('.scrollparent div', {
      x: '0%'
    })


    gsap.fromTo('.loginparent', {
      y: -10,
      opacity: 0
    }, {
      y: 0,
      opacity: 1
    })

  }

  function opensignup() {

    if (!showlogin) {
      return
    }

    setShowLogin(false)
    setError('')
    setSuccess('')

    gsap.to('.scrollparent div', {
      x: '100%'
    })

    gsap.fromTo('.loginparent', {
      y: -10,
      opacity: 0
    }, {
      y: 0,
      opacity: 1
    })

  }

  return (
    <>
    <div className="largeparent">

    <img src="/lime.jpg" alt="" className="hideonmobile"/>
    

    <div className="loginformlarge">

      <div className="select">
        <button id="" onClick={openlogin}>Login</button>
        <button id="" onClick={opensignup}>Sign Up</button>

        <div className="scrollparent">
          <div></div>
        </div>
      </div>

      <div className="loginparent">

      
    
     { !showlogin && <div className="loginform">
        <h2>Sign Up</h2>
        <input disabled={loading} type="text" ref={usernameref} placeholder="username" />
        <input disabled={loading} type="text" ref={emailref} placeholder="email" />
        <input disabled={loading} type="password" ref={passwordref} placeholder="password" />
        <input disabled={loading} type="password" ref={repeatpasswordref} placeholder="repeat password"
        />
        <button id="logbutton" disabled={loading} onClick={handleSignup}>
          Sign Up
        </button>

      </div>}

     { showlogin && <div className="loginform">
        <h2>Login</h2>
        <input disabled={loading} ref={loginemail} type="text" placeholder="email" />
        <input disabled={loading} ref={loginpassword} type="password" placeholder="password" />
        <button id="logbutton" disabled={loading} onClick={handleLogin}>Login</button>

        <button id="amdinlink" onClick={()=>navigate('/admin')}>Login as admin</button>

      </div>}
      

      {error && (
          <p className="loginmessage" id="error">
            {error}
          </p>
        )}
        {success && (
          <p className="loginmessage" id="success">
            {success}
          </p>
        )}

      </div>
      </div>

      </div>
    </>
  );
}

export default Login;
