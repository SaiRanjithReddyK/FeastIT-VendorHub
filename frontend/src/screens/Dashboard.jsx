import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../components/Header";
import Sidebar from "../components/Sidebar";
import "../assets/css/Dashboard.css"; // Custom CSS for Dashboard

function Dashboard() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [pdfPath, setPdfPath] = useState(null);
  const [pendingOrdersCount, setPendingOrdersCount] = useState(0);
  const navigate = useNavigate();
  
  useEffect(() => {
    const vendorName = localStorage.getItem("vendor_name");
    const vendorId = localStorage.getItem("vendor_id");
    if (!vendorName || !vendorId) {
      navigate("/vendorloginpage"); // Redirect to login if not authenticated
    } else {
      // Fetch pending orders count
      fetchPendingOrdersCount(vendorId);
      
      // Set up interval to refresh pending orders count every 30 seconds
      const intervalId = setInterval(() => {
        fetchPendingOrdersCount(vendorId);
      }, 30000);
      
      return () => clearInterval(intervalId); // Clean up on unmount
    }
  }, [navigate]);

  const fetchPendingOrdersCount = async (vendorId) => {
    try {
      const response = await fetch(`http://localhost:5001/api/vendor/${vendorId}/pending-orders-count`);
      if (response.ok) {
        const data = await response.json();
        setPendingOrdersCount(data.pending_count);
      }
    } catch (error) {
      console.error("Error fetching pending orders count:", error);
    }
  };

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const handlePDFDisplay = (fileName) => {
    setPdfPath(`/files/${fileName}`); // assuming PDFs are in public/files/
  };

  return (
    <div className="main-container">
      <div className="top-header">
        <Header toggleSidebar={toggleSidebar} />
      </div>

      <div className="content-layout">
        {isSidebarOpen && (
          <div className="sidebar-container">
            <Sidebar onOpenPDF={handlePDFDisplay} onClosePDF={() => setPdfPath("")} />
          </div>
        )}

        <div className={`dashboard-content ${isSidebarOpen ? "compact" : "expanded"}`}>
          {pdfPath ? (
            <iframe
              src={pdfPath}
              title="PDF Viewer"
              width="100%"
              height="100%"
              style={{ border: "none", minHeight: "80vh" }}
            ></iframe>
          ) : 
          
          <><><h2 className="dashboard-title">Welcome to Feast-IT Dashboard</h2><p className="dashboard-subtitle">Manage your restaurant orders, analytics, and settings.</p></><div className="dashboard-buttons">
                          <button className="dashboard-btn" onClick={() => navigate("/orders")}>📊 Orders</button>
                          <button className="dashboard-btn" onClick={() => navigate("/pending-orders")}>
                            📈 Current Orders
                            {pendingOrdersCount > 0 && (
                              <span className="notification-tag">{pendingOrdersCount}</span>
                            )}
                          </button>
                          <button className="dashboard-btn" onClick={() => navigate("/menu")}>📦 Menu</button>
                          <button className="dashboard-btn" onClick={() => navigate("/analytics")}>⚙️ Analytics</button>
                      </div></>

        }
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
