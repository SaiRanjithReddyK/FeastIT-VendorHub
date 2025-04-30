import React, { useState, useEffect, useRef } from "react";
import { FaSearch, FaEllipsisV } from "react-icons/fa"; 
import "../assets/css/OrderManagement.css"; 
import Header from "../components/Header"; 
import Sidebar from "../components/Sidebar"; 

function PendingOrders() {
  const [orders, setOrders] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [openActionMenu, setOpenActionMenu] = useState(null);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const vendorId = localStorage.getItem("vendor_id");

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await fetch(`http://localhost:5001/api/vendor/${vendorId}/orders`);
        const data = await res.json();
  
        const grouped = {};
  
        data.grouped_orders.forEach(order => {
          const { order_id, item_quantity, total_amount, order_status } = order;
          const itemNames = Object.entries(order)
            .filter(([key]) => key.startsWith("item_name"))
            .map(([_, name]) => name);
          const itemQuantities = Object.entries(order)
            .filter(([key]) => key.startsWith("item_quantity"))
            .map(([_, qty]) => qty);
  
          if (!grouped[order_id]) {
            grouped[order_id] = {
              order_id,
              item_names: [...itemNames],
              item_quantities: [...itemQuantities],
              total_amount,
              order_status
            };
          } else {
            grouped[order_id].item_names.push(...itemNames);
            grouped[order_id].item_quantities.push(...itemQuantities);
          }
        });
  
        const finalOrders = Object.values(grouped).map(order => ({
          ...order,
          item_name: order.item_names.join(", "),
          item_quantities: order.item_quantities
        }));
  
        setOrders(finalOrders);
      } catch (err) {
        console.error("Failed to fetch orders", err);
      }
    };
  
    fetchOrders();
  }, [vendorId]);

  const updateOrderStatus = async (orderId, newStatus) => {
    try {
      const response = await fetch(`http://localhost:5001/api/vendor/${vendorId}/orders/${orderId}/status`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: newStatus }),
      });
      
      if (response.ok) {
        // Update the local state to reflect the change
        setOrders(orders.map(order => 
          order.order_id === orderId 
            ? { ...order, order_status: newStatus } 
            : order
        ));
        setOpenActionMenu(null); // Close the action menu
      } else {
        console.error('Failed to update order status');
      }
    } catch (error) {
      console.error('Error updating order status:', error);
    }
  };
  
  const filteredOrders = orders.filter((order) => {
    const matchesSearch = order.item_name.toLowerCase().includes(searchTerm.toLowerCase()) || order.order_id.toString().includes(searchTerm);
    // Only show pending orders
    const isPending = order.order_status === "pending";
    return matchesSearch && isPending;
  });

  const getStatusClass = (status) => {
    switch (status) {
      case "delivered":
      case "confirmed":
      case "complete":
        return "status complete";
      case "pending":
      case "preparing":
      case "out for delivery":
        return "status pending";
      case "cancelled":
        return "status cancelled";
      default:
        return "status";
    }
  };

  const statusOptions = [
    "pending", 
    "confirmed", 
    "preparing", 
    "out for delivery", 
    "delivered", 
    "cancelled"
  ];

  return (
    <div className="main-container">
      <div className="top-header">
        <Header toggleSidebar={toggleSidebar} />
      </div>

      <div className="content-layout">
        {isSidebarOpen && <div className="sidebar-container"><Sidebar /></div>}

        <div className={`order-content ${isSidebarOpen ? "compact" : "expanded"}`}>
          <h2 className="order-title">Pending Orders</h2>
          
          <div className="filter-controls">
            {/* Search Input */}
            <div className="search-bar">
              <FaSearch className="search-icon" />
              <input
                type="text"
                placeholder="Search orders..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>

          {/* Table */}
          <div className="table-container">
            <table className="order-table">
              <thead>
                <tr>
                  <th>Order ID</th>
                  <th>Order Name</th>
                  <th>Quantity</th>
                  <th>Total</th>
                  <th>Status</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {filteredOrders.map((order, idx) => (
                  <tr key={idx}>
                    <td>{order.order_id}</td>
                    <td>
                      {order.item_names.map((name, idx) => (
                        <div key={idx}>{name}</div>
                      ))}
                    </td>
                    <td>
                      {order.item_quantities.map((qty, idx) => (
                        <div key={idx}>{qty}</div>
                      ))}
                    </td>
                    <td>${parseFloat(order.total_amount).toFixed(2)}</td>
                    <td className="status-cell">
                      <span className={getStatusClass(order.order_status)}>
                        {order.order_status}
                      </span>
                    </td>
                    <td className="action-cell">
                      <FaEllipsisV
                        className="action-icon"
                        onClick={() =>
                          setOpenActionMenu(openActionMenu === idx ? null : idx)
                        }
                      />
                      {openActionMenu === idx && (
                        <div className="action-menu">
                          <div className="action-menu-header">Change to:</div>
                          {statusOptions.map((status) => (
                            <button 
                              key={status}
                              onClick={() => updateOrderStatus(order.order_id, status)}
                              className={order.order_status === status ? "active-status" : ""}
                            >
                              {status.charAt(0).toUpperCase() + status.slice(1)}
                            </button>
                          ))}
                        </div>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

export default PendingOrders;
