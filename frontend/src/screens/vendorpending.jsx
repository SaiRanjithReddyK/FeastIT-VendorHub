import React from 'react';
import { useNavigate } from 'react-router-dom';
import "../assets/css/VendorApprovalStatus.css"; 
import logo from "../assets/images/logo.png";

function vendorpending() {

  const navigate = useNavigate();

  return (
    <div className="login-container">
      {/* Header */}
      <div className="orange-line">
        <div className="header-content">
          <img src={logo} alt="Feast-IT Logo" className="logo" />
          <span className="brand">Feast-IT</span>
        </div>
      </div>

      {/* Centered Content */}
      <div className="content-wrapper">
        <div className="background-box">
          {/* Success Image */}
          <img src="/images/happy.png" alt="Success" className="success-image" />

          {/* Success Message */}
          <div className="success-message">
            <h2 className="success-title">🎉 Your Application is under review!</h2>
            
            <p className="success-text">
              📩 Please check your email for updates on the approval process.
            </p>
            <p className="success-text">
              🍽️ Thank you for choosing <strong>Feast-IT</strong>!
            </p>

            <button className="back-to-login-button" onClick={() => navigate("/vendorloginpage")}>
              🔑 Back to Login
            </button>

          </div>
        </div>
      </div>
    </div>
  );
}

export default vendorpending;
