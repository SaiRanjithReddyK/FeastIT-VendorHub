import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import "../assets/css/VendorApprovalStatus.css"; 
import logo from "../assets/images/logo.png";

function VendorRejected() {
  const navigate = useNavigate();
  const [vendorName, setVendorName] = useState('');
  const [rejectedMessage, setRejectedMessage] = useState('');

  useEffect(() => {
    const name = localStorage.getItem("vendor_name") || '';
    const reason = localStorage.getItem("vendor_rejectedmessage") || '';
    setVendorName(name);
    setRejectedMessage(reason);
  }, []);

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
          {/* Rejected Image */}
          <img src="/images/sad.png" alt="Rejected" className="success-image" />

          {/* Rejected Message */}
          <div className="success-message">
            <h2 className="success-title">Your Application is Rejected</h2>

            <p className="success-text">
              Dear {vendorName}, we regret to inform you that your application was not approved.
            </p>

            {rejectedMessage ? (
              <p className="success-text">
                <strong>Reason:</strong> {rejectedMessage}
              </p>
            ) : (
              <p className="success-text">
                No specific reason was provided.
              </p>
            )}

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

export default VendorRejected;
