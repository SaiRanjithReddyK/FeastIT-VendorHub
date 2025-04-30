import React, { useState, useEffect } from "react";
import "../assets/css/OrderManagement.css"; 
import "../assets/css/VendorAnalytics.css"; // Import the new CSS file
import Header from "../components/Header"; 
import Sidebar from "../components/Sidebar"; 
import axios from 'axios';

// Custom analytics card component
const AnalyticsCard = ({ icon, value, label, colorClass, bgClass }) => {
  return (
    <div className={`analytics-card ${bgClass}`}>
      <div className={`card-icon ${colorClass}`}>{icon}</div>
      <div className="card-value">{value}</div>
      <div className="card-label">{label}</div>
    </div>
  );
};

function VendorAnalytics() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const vendorId = localStorage.getItem("vendor_id");

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`http://localhost:5001/vendor/${vendorId}/analytics`);
        setAnalytics(response.data);
        setError(null);
      } catch (err) {
        setError('Failed to load analytics data. Please try again later.');
        console.error('Error fetching analytics:', err);
      } finally {
        setLoading(false);
      }
    };

    if (vendorId) {
      fetchAnalytics();
    } else {
      setError('Vendor ID not found. Please log in again.');
      setLoading(false);
    }
  }, [vendorId]);

  // Define analytics cards data
  const getCardsData = () => {
    if (!analytics) return [];
    
    return [
      {
        icon: '🛒',
        value: analytics.total_orders,
        label: 'Total Orders',
        colorClass: 'color-orders',
        bgClass: 'bg-orders'
      },
      {
        icon: '💰',
        value: `$${analytics.total_revenue.toFixed(2)}`,
        label: 'Total Revenue',
        colorClass: 'color-revenue',
        bgClass: 'bg-revenue'
      },
      {
        icon: '👥',
        value: analytics.total_customers,
        label: 'Total Customers',
        colorClass: 'color-customers',
        bgClass: 'bg-customers'
      },
      {
        icon: '📊',
        value: `$${analytics.avg_order_value.toFixed(2)}`,
        label: 'Average Order Value',
        colorClass: 'color-avg-order',
        bgClass: 'bg-avg-order'
      },
      {
        icon: '🍔',
        value: analytics.total_menu_items,
        label: 'Menu Items',
        colorClass: 'color-menu-items',
        bgClass: 'bg-menu-items'
      },
      {
        icon: '⭐',
        value: analytics.avg_rating ? analytics.avg_rating.toFixed(1) : 'N/A',
        label: 'Average Rating',
        colorClass: 'color-rating',
        bgClass: 'bg-rating'
      }
    ];
  };

  return (
    <div className="main-container">
      <div className="top-header">
        <Header toggleSidebar={toggleSidebar} />
      </div>

      <div className="content-layout">
        {isSidebarOpen && <div className="sidebar-container"><Sidebar /></div>}

        <div className={`analytics-content ${isSidebarOpen ? "compact" : "expanded"}`}>
          {loading ? (
            <div className="loading-container">
              <div className="spinner"></div>
              <p>Loading analytics data...</p>
            </div>
          ) : error ? (
            <div className="error-container">
              <div className="error-title">Error</div>
              <div className="error-message">{error}</div>
            </div>
          ) : (
            <div className="analytics-container">
              <div className="analytics-title">Business Analytics Dashboard</div>
              <div className="analytics-subtitle">
                Overview of your business performance
              </div>
              
              {/* Two rows with three cards each, using full width */}
              <div className="cards-container">
                {/* First row */}
                <div className="cards-row">
                  {getCardsData().slice(0, 3).map((card, index) => (
                    <AnalyticsCard
                      key={index}
                      icon={card.icon}
                      value={card.value}
                      label={card.label}
                      colorClass={card.colorClass}
                      bgClass={card.bgClass}
                    />
                  ))}
                </div>
                
                {/* Second row */}
                <div className="cards-row">
                  {getCardsData().slice(3, 6).map((card, index) => (
                    <AnalyticsCard
                      key={index + 3}
                      icon={card.icon}
                      value={card.value}
                      label={card.label}
                      colorClass={card.colorClass}
                      bgClass={card.bgClass}
                    />
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default VendorAnalytics;
