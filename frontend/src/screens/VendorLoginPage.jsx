import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import "../assets/css/VendorLoginPage.css";
import logo from "../assets/images/logo.png";

function VendorLoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [showPopup, setShowPopup] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');
    setShowPopup(false);
    setIsLoading(true);
  
    try {
      const res = await fetch("http://127.0.0.1:5001/vendorLogin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: username, password }),
      });
      
      const data = await res.json();
  
      if (res.ok) {
        localStorage.setItem("vendor_id", data.vendor_id); 
        localStorage.setItem("vendor_name", data.vendor_name);
        localStorage.setItem("vendor_rejectedmessage", data.vendor_rejectedmessage || "");
        
        // Set success message and show popup
        setSuccessMsg("Login successful! Redirecting...");
        setShowPopup(true);
        
        // Add a fade-out effect before redirecting
        setTimeout(() => {
          document.querySelector('.login-container').classList.add('fade-out');
          
          setTimeout(() => {
            if (data.vendor_status === "pending") {
              navigate("/vendor-pending");
            } 
            else if (data.vendor_status === "rejected"){
              navigate("/vendor-rejected");
            }
            
            else if (data.vendor_status === "approved") {
              navigate("/dashboard");}
              
              else {
              setErrorMsg("Unknown vendor status.");
              setShowPopup(true);
              document.querySelector('.login-container').classList.remove('fade-out');
            }
          }, 500); // Wait for fade-out animation
        }, 1500);
      } else {
        setErrorMsg(data.error || "Invalid Credentials. Please try again.");
        setShowPopup(true);
        setIsLoading(false);
  
        // Shake effect for error
        const form = document.querySelector('.login-form');
        form.classList.add('shake');
        setTimeout(() => {
          form.classList.remove('shake');
        }, 500);
        
        setTimeout(() => {
          setShowPopup(false);
        }, 3000);
      }
    } catch (err) {
      console.error("Login error:", err);
      setErrorMsg("Server error. Please try again later.");
      setShowPopup(true);
      setIsLoading(false);
    }
  };
  

  return (
    <div className="login-container">
      <div className="orange-line">
        <span style={{ display: 'flex', alignItems: 'center' }}>
          <img src={logo} alt="Logo" style={{ margin: "10px 20px" }} />
          <span className='brand'>Feast-IT</span>
        </span>
      </div>

      <div className="login-form-wrapper">
        <div className="background-box">
          <p className='h1'>Welcome back!</p>
          <p className='h2'>Enter your credentials to access your account</p>

          <form onSubmit={handleSubmit} className="login-form">
            <div className="form-group">
              <label htmlFor="username">Vendor Email</label>
              <input
                type="text"
                id="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                className={errorMsg ? "input-error" : ""}
                placeholder="Enter your email address"
              />
            </div>

            <div className="form-group">
              <label htmlFor="password">Password</label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className={errorMsg ? "input-error" : ""}
                placeholder="Enter your password"
              />
              <Link to="/vendor-forgotpass" className="link">Forgot password?</Link>
            </div>

            <button 
              type="submit" 
              className="login-btn"
            >
              Login
            </button>

            <div className='signup-link'>
              Don't have an account?
              <Link to="/vendor-signUp" className="link"> Sign Up</Link>
            </div>
          </form>
        </div>
      </div>

      {/* Popup for success or error */}
      {showPopup && (
        <div className={`popup-message ${errorMsg ? "error-popup" : "success-popup"} ${showPopup ? "popup-show" : ""}`}>
          {errorMsg || successMsg}
          <button
            className="popup-close"
            onClick={() => {
              setShowPopup(false);
              setErrorMsg('');
              setSuccessMsg('');
            }}
          >
            ×
          </button>
        </div>
      )}
    </div>
  );
}

export default VendorLoginPage;
