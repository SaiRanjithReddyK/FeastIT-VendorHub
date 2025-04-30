import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom"; // Add useNavigate
import { ToastContainer, toast } from "react-toastify"; // Import Toastify
import "react-toastify/dist/ReactToastify.css"; // Import Toastify styles
import "../assets/css/VendorLoginPage.css";
import "../assets/css/VendorForgotPass.css";
import logo from "../assets/images/logo.png";

function VendorForgotPass() {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate(); // Initialize navigate

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (email.trim() === "") {
      toast.error("❌ Please enter a valid email address.");
      return;
    }
    
    setIsLoading(true);

    try {
      // Check if the email exists using your new endpoint
      const res = await fetch("http://127.0.0.1:5001/check-email-exists", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      
      const data = await res.json();
      
      if (res.ok && data.exists) {
        // Email exists, store it and redirect to reset password page
        toast.success("Email verified. Redirecting to reset password page...");
        
        // Store the verified email in sessionStorage for the reset password page
        sessionStorage.setItem("resetEmail", email);
        
        // Redirect to reset password page after a short delay
        setTimeout(() => {
          navigate("/reset-password");
        }, 1500);
      } else {
        // Email doesn't exist
        toast.error("❌ Email not registered with us. Please check your email or sign up.");
      }
    } catch (error) {
      console.error("Email verification error:", error);
      toast.error("❌ Server error. Please try again later.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="orange-line">
        <span style={{ display: "flex", alignItems: "center" }}>
          <img
            src={logo}
            alt="Description"
            style={{ margin: "10px", marginRight: "20px", marginLeft: "20px" }}
          />
          <span className="brand">Feast-IT</span>
        </span>
      </div>

      <div className="forgot-password-wrapper">
        <div className="forgot-password-box">
          {/* ✅ Centered Heading */}
          <h2 className="forgot-password-title">Forgot Password?</h2>

          {/* ✅ Centered Subtitle */}
          <p className="forgot-password-subtitle">
            Enter your email address to reset your password
          </p>

          {/* Forgot Password Form */}
          <form onSubmit={handleSubmit} className="forgot-password-form">
            <div className="form-group">
              <label htmlFor="email">Email Address</label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="Enter your registered email"
              />
            </div>

            {/* Buttons */}
            <div className="forgot-password-buttons">
              <button 
                type="submit" 
                className="forgot-password-submit"
                disabled={isLoading}
              >
                {isLoading ? (
                  <span className="loading-spinner">
                    <span className="spinner"></span> Verifying...
                  </span>
                ) : (
                  "Submit"
                )}
              </button>
              <Link to="/vendorloginpage" className="forgot-password-back">
                Back
              </Link>
            </div>
          </form>
        </div>
      </div>

      {/* Toast Notifications Container */}
      <ToastContainer position="top-center" autoClose={3000} hideProgressBar />
    </div>
  );
}

export default VendorForgotPass;
