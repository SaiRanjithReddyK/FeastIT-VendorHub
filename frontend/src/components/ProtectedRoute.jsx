
import React from "react";
import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ children }) => {
  const isLoggedIn = localStorage.getItem("vendor_id");

  if (!isLoggedIn) {
    return <Navigate to="/vendorloginpage" replace />;
  }

  return children;
};

export default ProtectedRoute;
