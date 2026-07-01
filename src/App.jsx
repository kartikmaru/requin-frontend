import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "./context/AuthContext";

import Navbar          from "./components/Navbar";
import ProtectedRoute  from "./components/ProtectedRoute";
import LoginPage       from "./pages/LoginPage";
import RegisterPage    from "./pages/RegisterPage";
import UnauthorizedPage from "./pages/UnauthorizedPage";
import DashboardPage   from "./pages/DashboardPage";
import ProductsPage    from "./pages/user/ProductsPage";
import ProductDetails  from "./pages/user/ProductDetails";
import MyOrders        from "./pages/user/MyOrders";
import AdminDashboard  from "./pages/admin/AdminDashboard";
import AdminProducts   from "./pages/admin/AdminProducts";
import AddProduct      from "./pages/admin/AddProduct";
import EditProduct     from "./pages/admin/EditProduct";
import AdminOrders     from "./pages/admin/AdminOrders";

const RootRedirect = () => {
  const { user, loading } = useAuth();
  if (loading) return null;
  if (!user) return <Navigate to="/login" replace />;
  return <Navigate to="/dashboard" replace />;
};

const App = () => (
  <>
    <Navbar />
    <Routes>
      <Route path="/login"        element={<LoginPage />} />
      <Route path="/register"     element={<RegisterPage />} />
      <Route path="/unauthorized" element={<UnauthorizedPage />} />

      <Route path="/dashboard"   element={<ProtectedRoute allowedRoles={["user","admin"]}><DashboardPage /></ProtectedRoute>} />
      <Route path="/products"    element={<ProtectedRoute allowedRoles={["user","admin"]}><ProductsPage /></ProtectedRoute>} />
      <Route path="/products/:id" element={<ProtectedRoute allowedRoles={["user","admin"]}><ProductDetails /></ProtectedRoute>} />
      <Route path="/my-orders"   element={<ProtectedRoute allowedRoles={["user","admin"]}><MyOrders /></ProtectedRoute>} />

      <Route path="/admin/dashboard"           element={<ProtectedRoute allowedRoles={["admin"]}><AdminDashboard /></ProtectedRoute>} />
      <Route path="/admin/products"            element={<ProtectedRoute allowedRoles={["admin"]}><AdminProducts /></ProtectedRoute>} />
      <Route path="/admin/products/add"        element={<ProtectedRoute allowedRoles={["admin"]}><AddProduct /></ProtectedRoute>} />
      <Route path="/admin/products/edit/:id"   element={<ProtectedRoute allowedRoles={["admin"]}><EditProduct /></ProtectedRoute>} />
      <Route path="/admin/orders"              element={<ProtectedRoute allowedRoles={["admin"]}><AdminOrders /></ProtectedRoute>} />

      <Route path="/"  element={<RootRedirect />} />
      <Route path="*"  element={<div className="max-w-4xl mx-auto px-4 py-20 text-center"><h2 className="text-2xl font-bold text-slate-700">404 — Page Not Found</h2></div>} />
    </Routes>
  </>
);

export default App;
