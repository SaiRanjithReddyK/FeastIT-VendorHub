import React, { useState } from "react";
import { useNavigate } from "react-router-dom"; 
import FileUpload from "../components/FileUpload";
import bgImage from "../assets/images/VendorLoginBackground.png"; 
import "../assets/css/VendorSignUpPage.css"; 
import logo from "../assets/images/logo.png"; 

function VendorSignUp() {
  const navigate = useNavigate(); 

  const [businessDocs, setBusinessDocs] = useState(null);
  const [supportDocs, setSupportDocs] = useState(null);

  const handleSubmit = async (event) => {
    event.preventDefault();

    const form = event.target;
    const business_name = form.elements["business_name"].value;
    const address = `${form.elements["line1"].value}, ${form.elements["line2"].value}, ${form.elements["city"].value}, ${form.elements["state"].value}, ${form.elements["zip"].value}, United states`;
    const first_name = form.elements["first_name"].value;
    const last_name = form.elements["last_name"].value;
    const vendor_name = `${first_name} ${last_name}`;
    const vendor_email = form.elements["email"].value;
    const vendor_phone = form.elements["phone"].value;
    const vendor_password = form.elements["passwd"].value;
    const vendor_description = form.elements["vendor_description"].value;
    const vendor_taxId = form.elements["vendor_taxId"].value;
    const business_hours = ""; // defaulting empty

    const formData = new FormData();
    formData.append("business_name", business_name);
    formData.append("vendor_name", vendor_name);
    formData.append("vendor_email", vendor_email);
    formData.append("vendor_phone", vendor_phone);
    formData.append("vendor_password", vendor_password);
    formData.append("vendor_description", vendor_description);
    formData.append("vendor_taxId", vendor_taxId);
    formData.append("vendor_address", address);
    formData.append("business_hours", business_hours);
    if (businessDocs) {
      formData.append("vendor_registrationcertificate", businessDocs);
    }
    if (supportDocs) {
      formData.append("vendor_supportingdocument", supportDocs);
    }


    try {
      const res = await fetch("http://127.0.0.1:5001/register", {
        method: "POST",
        body: formData,
      });

      if (res.ok) {
        const data = await res.json();
        console.log("Registration successful!", data);
        
        // Then navigate
        navigate("/vendor-approval");
      } else {
        const err = await res.json();
        alert(err.message || "Registration failed. Try again.");
      }
    } catch (error) {
      console.error("Error during registration:", error);
      alert("Server error. Please try again later.");
    }  };

  return (
    <div className="signup-page" style={{ backgroundImage: `url(${bgImage})` }}>
      {/* Header */}
      <div className="orange-line">
        <span className="header-content">
          <img src={logo} alt="Logo" className="logo" />
          <span className="brand">Feast-IT</span>
        </span>
      </div>
      
      {/* Content Section */}
      <div className="signup-container">
        <span>
          <h2 className="vendor-title">Vendor Registration</h2>
          <h3 className="vendor-subtitle">SignUp as a Vendor</h3>
        </span>
        <div className="signup-background-box">
          {/* Form */}
          <form className="signup-form" onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Business Name</label>
              <input name= "business_name" type="text" placeholder="Enter the name of your restaurant" className="signup-input" required />
            </div>

            <div className="form-group">
              <label>Address</label>
              <input name= "line1" type="text" placeholder="Address Line 1" className="address-signup-input" required />
              <input name= "line2" type="text" placeholder="Address Line 2" className="address-signup-input" required />
              <div className="grid-container">
                <input name= "city" type="text" placeholder="City" className="two-column-input" required />
                <input name= "state" type="text" placeholder="State" className="two-column-input" required />
              </div>
              <div className="grid-container">
                <input
                  name= "zip" 
                  type="text"
                  placeholder="Postal / Zip code"
                  className="two-column-input"
                  pattern="[0-9]{5}"
                  maxLength="5"
                  inputMode="numeric"
                  onInput={(e) => e.target.value = e.target.value.replace(/[^0-9]/g, '')}
                  required
                />
                <input name= "country" type="text" value="United States" disabled className="two-column-input" />
              </div>
            </div>

            <div className="grid-container">
              <div className="form-group">
                <label>First Name</label>
                <input name="first_name" type="text" placeholder="First Name" className="two-column-input" required />
              </div>
              <div className="form-group">
                <label>Last Name</label>
                <input name="last_name" type="text" placeholder="Last Name" className="two-column-input" required />
              </div>
            </div>

            <div className="form-group">
              <label>Email Address</label>
              <input name= "email" type="email" placeholder="John.doe@example.com" className="signup-input" required />
            </div>

            <div className="form-group">
              <label>Phone Number</label>
              <input
                name= "phone" 
                type="tel"
                placeholder="Enter your phone number"
                className="signup-input"
                pattern="[0-9]{10}"
                maxLength="10"
                inputMode="numeric"
                onInput={(e) => e.target.value = e.target.value.replace(/[^0-9]/g, '')}                required
              />
            </div>

            <div className="grid-container">
              <div className="form-group">
                <label>Password</label>
                <input
                  name= "passwd" 
                  type="password"
                  placeholder="Create password"
                  className="two-column-input"
                  id="password"
                  required
                />
              </div>
              <div className="form-group">
                <label>Confirm Password</label>
                <input
                  name= "con_passwd" 
                  type="password"
                  placeholder="Confirm password"
                  className="two-column-input"
                  id="confirmPassword"
                  onInput={(e) =>
                    e.target.setCustomValidity(e.target.value !== document.getElementById('password').value ? 'Passwords do not match' : '')
                  }                  required
                />
              </div>
            </div>

            <div className="form-group">
              <label>Tell us about your business idea and what makes it unique (in 300 words or less).</label>
              <textarea
                name="vendor_description"
                placeholder="Describe your food business, what makes it special, and how it will benefit customers."
                className="textarea-input"
                onInput={(e) => {
                  let words = e.target.value.trim().split(/\s+/);
                  if (words.length > 300) {
                    e.target.value = words.slice(0, 300).join(" ") + " ";
                  }
                }}                
                required
              ></textarea>
            </div>

            <div className="form-group">
              <label>Tax Identification Number (TIN)</label>
              <input
                name="vendor_taxId"
                type="text"
                placeholder="Enter TIN or EIN"
                className="signup-input"
                pattern="[0-9]{9}"
                maxLength="9"
                inputMode="numeric"
                onInput={(e) => e.target.value = e.target.value.replace(/[^0-9]/g, '')}


                required
              />
            </div>

            <div className="file-upload-container">
              <label className="file-label">Business Registration Certificate</label>
              <FileUpload onFileSelect={setBusinessDocs} inputId="businessDocs" />
              </div>

            <div className="file-upload-container">
              <label className="file-label">Upload Supporting Documents (Food safety & health permits)</label>
              <FileUpload onFileSelect={setSupportDocs} inputId="supportDocs" />
              </div>

            <div className="terms-container">
              <input type="checkbox" className="signup-checkbox" required />
              <label className="terms-label">I agree to </label>
              <a href="/public/files/Terms_of_Service.pdf" className="Terms-link" target="_blank" rel="noopener noreferrer">
                Terms of Service
              </a>
            </div>

            <button type="submit" className="submit-button">Send Application</button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default VendorSignUp;
