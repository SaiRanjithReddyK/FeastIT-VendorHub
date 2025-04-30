import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../assets/css/Sidebar.css";
import ProfileManagement from "../screens/ProfileManagement";

function Sidebar({ onOpenPDF, onClosePDF }) {
  const navigate = useNavigate();
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const [showProfileModal, setShowProfileModal] = useState(false);

  // Handle Logout Confirmation
  const handleLogout = () => {
    localStorage.removeItem("userToken");
    localStorage.removeItem("vendor_id");
    localStorage.removeItem("vendor_name");
    navigate("/vendorloginpage");
  };

  const handleGoToDashboard = () => {
    onClosePDF?.(); // Safely call if defined
    navigate("/dashboard");
  };

  // Enhanced PDF opener with styling
  const handleOpenPDF = (pdfName) => {
    // Call the original onOpenPDF function
    onOpenPDF(pdfName);
    
    // Add a class to the body to prevent scrolling when PDF is open
    document.body.classList.add('pdf-open');
  };

  return (
    <div className="sidebar">
      <div className="sidebar-menu">
        <button className="sidebar-btn" onClick={handleGoToDashboard}>Dashboard</button>
        <button className="sidebar-btn" onClick={() => setShowProfileModal(true)}>Profile</button>
        <button className="sidebar-btn" onClick={() => handleOpenPDF("TalktoAdmin.pdf")}>
           Talk to Admin 
          <span className="btn-icon">📝</span>
          
        </button>
        <button className="sidebar-btn" onClick={() => handleOpenPDF("VendorHelpCenter.pdf")}>
          Help Center
          <span className="btn-icon">❓</span>
        </button>
        <button className="sidebar-btn logout-btn" onClick={() => setShowLogoutConfirm(true)}>Logout</button>
      </div>

      {showLogoutConfirm && (
        <div className="logout-overlay">
          <div className="logout-modal">
            <h3>Logout Confirmation</h3>
            <p>Are you sure you want to log out?</p>
            <div className="logout-buttons">
              <button className="confirm-btn" onClick={handleLogout}>Confirm</button>
              <button className="cancel-btn" onClick={() => setShowLogoutConfirm(false)}>Cancel</button>
            </div>
          </div>
        </div>
      )}

      <ProfileManagement
        isOpen={showProfileModal}
        onClose={() => setShowProfileModal(false)}
      />
    </div>
  );
}

export default Sidebar;
