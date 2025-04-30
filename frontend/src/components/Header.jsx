import React, { useEffect, useState } from "react"; // ✅ Import useState
import { FaBars } from "react-icons/fa"; // Import Hamburger Icon
import logo from "../assets/images/logo.png";
import "../components/Header.css"; // Ensure the CSS file exists

function Header({ toggleSidebar }) {
  const [isClicked, setIsClicked] = useState(false); // ✅ Fix: Import useState

  const handleClick = () => {
    setIsClicked(!isClicked); // Toggle color state
    toggleSidebar(); // Call function to toggle sidebar
  };

  const [vendorName, setVendorName] = useState("Vendor");

useEffect(() => {
  const name = localStorage.getItem("vendor_name");
  if (name) setVendorName(name);
}, []);


  return (
    <div className="orange-line">
      <div className="header-content">
        {/* Sidebar Toggle Button */}
        <FaBars 
          className={`hamburger-icon ${isClicked ? "clicked" : ""}`} 
          onClick={handleClick} 
        /> 
        {/* Logo and Brand Name */}
        <img src={logo} alt="Feast-IT Logo" className="logo" />
        <span className="brand">Feast-IT</span>
        
      </div>

      <div className="right-section">
        {vendorName && (
          <span className="welcome-text">
            Welcome, <span className="vendor-name">{vendorName}</span>
          </span>
        )}
      </div>
      
    </div>
  );
}

export default Header;

