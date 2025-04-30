import React, { useEffect, useState } from "react";
import Header from "../components/Header";
import Sidebar from "../components/Sidebar";
import axios from "axios";
import "../assets/css/MenuManagement.css";

function MenuManagement() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [menuItems, setMenuItems] = useState([]);

  const vendorId = localStorage.getItem("vendor_id"); // ✅ dynamically pulled

  useEffect(() => {
    if (vendorId) fetchMenuItems();
  }, [vendorId]);

  const fetchMenuItems = async () => {
    try {
      const res = await axios.get(`http://localhost:5001/vendor/${vendorId}/menu`);
      console.log("Menu items:", res.data);
      setMenuItems(res.data);
    } catch (err) {
      console.error("Failed to fetch menu items:", err);
    }
  };

  const handleDeleteItem = async (itemId) => {
    if (window.confirm("Are you sure you want to delete this item?")) {
      try {
        await axios.delete(`http://localhost:5001/vendor/${vendorId}/menu/${itemId}`);
        fetchMenuItems();
      } catch (err) {
        console.error("Error deleting item:", err);
      }
    }
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    const form = e.target;
    const itemData = {
      item_name: form.itemName.value,
      description: form.itemDescription.value,
      category: form.itemCategory.value,
      price: parseFloat(form.itemPrice.value),
      nutritional_info: "",
      availability: true
    };

    try {
      if (selectedItem) {
        await axios.put(`http://localhost:5001/vendor/${vendorId}/menu/${selectedItem.item_id}`, itemData);
      } else {
        await axios.post(`http://localhost:5001/vendor/${vendorId}/menu`, itemData);
      }
      fetchMenuItems();
      setShowModal(false);
      setSelectedItem(null);
    } catch (err) {
      console.error("Error saving item:", err);
    }
  };

  return (
    <div className="main-container">
      <div className="top-header">
        <Header toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)} />
      </div>

      <div className="content-layout">
        {isSidebarOpen && (
          <div className="sidebar-container">
            <Sidebar />
          </div>
        )}

        <div className={`order-content ${isSidebarOpen ? "compact" : "expanded"}`}>
          <div className="title-bar">
            <h2 className="order-title">Menu Management</h2>
            <div className="button-group">
              <button className="add-button" onClick={() => {
                setSelectedItem(null);
                setShowModal(true);
              }}>Add Menu Item</button>
              <button className="edit-button" onClick={() => setEditMode(!editMode)}>
                {editMode ? "Cancel Edit" : "Edit Menu"}
              </button>
            </div>
          </div>

          {/* Table */}
          <div className="table-container">
            <table className="order-table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Description</th>
                  <th>Price</th>
                  <th>Category</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {menuItems.map((item) => (
                  <tr key={item.item_id}>
                    <td>{item.item_name}</td>
                    <td className="truncate-text" title={item.description}>{item.description}</td>
                    <td>${item.price.toFixed(2)}</td>
                    <td>{item.category}</td>
                    <td>
                      {editMode ? (
                        <div className="action-buttons">
                          <button className="edit-action-button" onClick={() => {
                            setSelectedItem(item);
                            setShowModal(true);
                          }}>Edit</button>
                          <button className="delete-action-button" onClick={() => handleDeleteItem(item.item_id)}>Delete</button>
                        </div>
                      ) : (
                        <button className="action-button" onClick={() => {
                          setSelectedItem(item);
                          setShowModal(true);
                        }}>View / Edit</button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Modal */}
          {showModal && (
            <div className="modal-overlay" onClick={() => setShowModal(false)}>
              <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                <div className="modal-header">
                  <h3>{selectedItem ? "Edit Menu Item" : "Add Menu Item"}</h3>
                  <button className="modal-close" onClick={() => {
                    setShowModal(false);
                    setSelectedItem(null);
                  }}>×</button>
                </div>
                <form className="menu-form" onSubmit={handleFormSubmit}>
                  <label>Name</label>
                  <input type="text" name="itemName" required defaultValue={selectedItem?.item_name || ""} />

                  <label>Description</label>
                  <textarea name="itemDescription" rows="3" required defaultValue={selectedItem?.description || ""} />

                  <label>Category</label>
                  <select name="itemCategory" required defaultValue={selectedItem?.category || ""}>
                    <option value="">Select a category</option>
                    <option value="Vegan">Vegan</option>
                    <option value="Non-Vegan">Non-Vegan</option>
                    <option value="Vegetarian">Vegetarian</option>
                    <option value="Gluten-Free">Gluten-Free</option>
                    <option value="Healthy">Healthy</option>
                    <option value="Sugar-Free">Sugar-Free</option>
                  </select>

                  <label>Price</label>
                  <input type="number" name="itemPrice" step="0.01" min="0" required defaultValue={selectedItem?.price || ""} />

                  <button type="submit" className="save-button">
                    {selectedItem ? "Update Item" : "Save Item"}
                  </button>
                </form>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default MenuManagement;
