import React, { useEffect, useState } from "react";
import axios from "axios";
import "../assets/css/ProfileManagement.css";

function ProfileManagement({ isOpen, onClose }) {
  const vendorId = localStorage.getItem("vendor_id");

  const [formData, setFormData] = useState({
    vendor_name: "",
    vendor_email: "",
    vendor_phone: "",
    business_name: "",
    vendor_address: "",
    business_hours: ""
  });

  const [passwordData, setPasswordData] = useState({
    current_password: "",
    new_password: ""
  });

  const [activeTab, setActiveTab] = useState("basic");
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    if (vendorId && isOpen) fetchProfile();
  }, [isOpen]);

  const fetchProfile = async () => {
    try {
      const res = await axios.get(`http://localhost:5001/vendor/${vendorId}`);
      setFormData(res.data);
    } catch (err) {
      console.error("Failed to fetch vendor profile", err);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordData((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const endpoint = `http://localhost:5001/vendor/${vendorId}`;
    try {
      await axios.put(endpoint, formData);
      alert("Profile updated successfully");
      setIsEditing(false);
    } catch (err) {
      console.error("Failed to update profile", err);
      alert("Failed to save profile changes");
    }
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.put(`http://localhost:5001/vendor/${vendorId}/update-password`, passwordData);
      alert(res.data.message);
      setPasswordData({ current_password: "", new_password: "" });
    } catch (err) {
      alert(err.response?.data?.error || "Failed to update password");
    }
  };

  if (!isOpen) return null;

  return (
    <div className="profile-modal-overlay" onClick={onClose}>
      <div className="profile-modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="profile-modal-header">
          <h2>Profile Management</h2>
          <button className="profile-close-button" onClick={onClose}>×</button>
        </div>

        <div className="profile-tabs">
          <button className={activeTab === "basic" ? "active" : ""} onClick={() => setActiveTab("basic")}>Basic Info</button>
          <button className={activeTab === "business" ? "active" : ""} onClick={() => setActiveTab("business")}>Business Details</button>
          <button className={activeTab === "security" ? "active" : ""} onClick={() => setActiveTab("security")}>Security</button>
        </div>

        <div className="profile-content">
          {/* -------------------- Basic Info -------------------- */}
          {activeTab === "basic" && (
            <form onSubmit={handleSubmit}>
              <div className="profile-form-header">
                <h3>Basic Information</h3>
                {!isEditing && <button type="button" className="profile-edit-button" onClick={() => setIsEditing(true)}>Edit</button>}
              </div>
              <div className="profile-form-group">
                <label>Name</label>
                <input type="text" name="vendor_name" value={formData.vendor_name} onChange={handleChange} readOnly={!isEditing} />
              </div>
              <div className="profile-form-group">
                <label>Email</label>
                <input type="email" name="vendor_email" value={formData.vendor_email} onChange={handleChange} readOnly={!isEditing} />
              </div>
              <div className="profile-form-group">
                <label>Phone</label>
                <input type="text" name="vendor_phone" value={formData.vendor_phone} onChange={handleChange} readOnly={!isEditing} />
              </div>
              {isEditing && (
                <div className="profile-button-group">
                  <button type="submit" className="profile-save-button">Save Changes</button>
                  <button type="button" className="profile-cancel-button" onClick={() => setIsEditing(false)}>Cancel</button>
                </div>
              )}
            </form>
          )}

          {/* -------------------- Business Info -------------------- */}
          {activeTab === "business" && (
            <form onSubmit={handleSubmit}>
              <div className="profile-form-header">
                <h3>Business Details</h3>
                {!isEditing && <button type="button" className="profile-edit-button" onClick={() => setIsEditing(true)}>Edit</button>}
              </div>
              <div className="profile-form-group">
                <label>Business Name</label>
                <input type="text" name="business_name" value={formData.business_name} onChange={handleChange} readOnly={!isEditing} />
              </div>
              <div className="profile-form-group">
                <label>Business Address</label>
                <textarea name="vendor_address" rows="2" value={formData.vendor_address} onChange={handleChange} readOnly={!isEditing} />
              </div>
              <div className="profile-form-group">
                <label>Business Hours</label>
                <textarea name="business_hours" rows="2" value={formData.business_hours} onChange={handleChange} readOnly={!isEditing} />
              </div>
              {isEditing && (
                <div className="profile-button-group">
                  <button type="submit" className="profile-save-button">Save Changes</button>
                  <button type="button" className="profile-cancel-button" onClick={() => setIsEditing(false)}>Cancel</button>
                </div>
              )}
            </form>
          )}

          {/* -------------------- Security Tab -------------------- */}
          {activeTab === "security" && (
            <form onSubmit={handlePasswordSubmit}>
              <div className="profile-form-header">
                <h3>Update Password</h3>
              </div>
              <div className="profile-form-group">
                <label>Current Password</label>
                <input type="password" name="current_password" value={passwordData.current_password} onChange={handlePasswordChange} required />
              </div>
              <div className="profile-form-group">
                <label>New Password</label>
                <input type="password" name="new_password" value={passwordData.new_password} onChange={handlePasswordChange} required />
              </div>
              <div className="profile-button-group">
                <button type="submit" className="profile-save-button">Update Password</button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}

export default ProfileManagement;
