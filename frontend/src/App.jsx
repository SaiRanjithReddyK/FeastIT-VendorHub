import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import VendorLoginPage from "./screens/VendorLoginPage";
import VendorSignUp from "./screens/VendorSignUp"; 
import VendorApprovalStatus from "./screens/VendorApprovalStatus";
import OrderManagement from "./screens/OrderManagement";
import PendingOrders from "./screens/pendingorders";
import VendorForgotPass from "./screens/VendorForgotPass";
import Dashboard from "./screens/Dashboard";
import Menu from "./screens/MenuManagement";
import VendorPending from "./screens/vendorpending";
import VendorReject from "./screens/vendorrejected";
import ProtectedRoute from "./components/ProtectedRoute";
import ResetPass from "./screens/ResetPassword";
import VendorAnalytics from './screens/VendorAnalytics';




function App() {
  return (
    <Router>
      <Routes>
        <Route path="/vendorloginpage" element={<VendorLoginPage />} />
        <Route path="/vendor-signup" element={<VendorSignUp />} />
        <Route path="/vendor-approval" element={<VendorApprovalStatus />} />
        <Route path="/vendor-pending" element={<ProtectedRoute> <VendorPending /> </ProtectedRoute>} />
        <Route path="/vendor-rejected" element={<ProtectedRoute> <VendorReject /> </ProtectedRoute>} />
        <Route path="/orders" element={<ProtectedRoute> <OrderManagement /> </ProtectedRoute>} />
        <Route path="/pending-orders" element={<ProtectedRoute> <PendingOrders /> </ProtectedRoute>} />
        <Route path="/vendor-forgotpass" element={<VendorForgotPass />} />
        <Route path="/dashboard" element={<ProtectedRoute> <Dashboard /> </ProtectedRoute>} />
        <Route path="/menu" element={<ProtectedRoute> <Menu /> </ProtectedRoute>} />
        <Route path="/reset-password" element={ <ResetPass />} />
        <Route path="/analytics" element={<ProtectedRoute> <VendorAnalytics /> </ProtectedRoute>} />
      </Routes>
    </Router>
  );
}

export default App;
