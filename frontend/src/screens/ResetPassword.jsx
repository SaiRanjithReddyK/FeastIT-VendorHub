import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "../assets/css/VendorLoginPage.css";
import "../assets/css/VendorForgotPass.css";
import logo from "../assets/images/logo.png";

function ResetPassword() {
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    // Get the email from sessionStorage
    const resetEmail = sessionStorage.getItem("resetEmail");
    if (!resetEmail) {
      // If no email is found, redirect back to forgot password page
      toast.error("Please enter your email first");
      navigate("/vendorforgotpass");
    } else {
      setEmail(resetEmail);
    }
  }, [navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate passwords
    if (newPassword.trim() === "") {
      toast.error("❌ Please enter a new password.");
      return;
    }
    
    if (newPassword !== confirmPassword) {
      toast.error("❌ Passwords do not match.");
      return;
    }
    
    setIsLoading(true);

    try {
      const res = await fetch("http://127.0.0.1:5001/reset-vendor-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          email: email,
          new_password: newPassword 
        }),
      });
      
      const data = await res.json();
      
      if (res.ok) {
        toast.success("Password reset successful! Redirecting to login...");
        
        // Clear the email from sessionStorage
        sessionStorage.removeItem("resetEmail");
        
        // Redirect to login page after a short delay
        setTimeout(() => {
          navigate("/vendorloginpage");
        }, 2000);
      } else {
        toast.error(`❌ ${data.error || "Failed to reset password. Please try again."}`);
      }
    } catch (error) {
      console.error("Password reset error:", error);
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
          <h2 className="forgot-password-title">Reset Password</h2>

          <p className="forgot-password-subtitle">
            Enter your new password for {email}
          </p>

          <form onSubmit={handleSubmit} className="forgot-password-form">
            <div className="form-group">
              <label htmlFor="newPassword">New Password</label>
              <input
                type="password"
                id="newPassword"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                required
                placeholder="Enter new password"
              />
            </div>

            <div className="form-group">
              <label htmlFor="confirmPassword">Confirm Password</label>
              <input
                type="password"
                id="confirmPassword"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                placeholder="Confirm new password"
              />
            </div>

            <div className="forgot-password-buttons">
              <button 
                type="submit" 
                className="forgot-password-submit"
                disabled={isLoading}
              >
                {isLoading ? (
                  <span className="loading-spinner">
                    <span className="spinner"></span> Resetting...
                  </span>
                ) : (
                  "Reset Password"
                )}
              </button>
            </div>
          </form>
        </div>
      </div>

      <ToastContainer position="top-center" autoClose={3000} hideProgressBar />
    </div>
  );
}

export default ResetPassword;
