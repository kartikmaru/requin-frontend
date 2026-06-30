import React from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const isAdminView = location.pathname.startsWith("/admin");

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const navLink = (to, label) => {
    const active = location.pathname === to;
    return (
      <Link
        to={to}
        className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
          active
            ? "bg-white/20 text-white font-semibold"
            : "text-indigo-200 hover:text-white hover:bg-white/10"
        }`}
      >
        {label}
      </Link>
    );
  };

  return (
    <nav className="sticky top-0 z-50 bg-indigo-600 shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-14">

          {/* Brand */}
          <Link
            to={user ? "/dashboard" : "/login"}
            className="flex items-center gap-2 text-white font-extrabold text-lg tracking-tight"
          >
            <span>⚡</span> MERN App
          </Link>

          {/* Nav links */}
          <div className="flex items-center gap-1.5 flex-wrap">
            {user ? (
              <>
                {/* User-facing links */}
                {!isAdminView && (
                  <>
                    {navLink("/dashboard", "Dashboard")}
                    {navLink("/products",  "Products")}
                    {navLink("/my-orders", "My Orders")}
                  </>
                )}

                {/* Admin links */}
                {isAdminView && user.role === "admin" && (
                  <>
                    {navLink("/admin/dashboard", "Home")}
                    {navLink("/admin/products",  "Products")}
                    {navLink("/admin/orders",    "Orders")}
                  </>
                )}

                {/* Role toggle — admin only */}
                {user.role === "admin" && (
                  <button
                    onClick={() => navigate(isAdminView ? "/dashboard" : "/admin/dashboard")}
                    className={`ml-1 px-3 py-1.5 rounded-md text-sm font-bold text-white border border-white/25 transition-colors ${
                      isAdminView
                        ? "bg-indigo-700 hover:bg-indigo-800"
                        : "bg-slate-900/70 hover:bg-slate-900"
                    }`}
                  >
                    {isAdminView ? "👤 User View" : "🛡️ Admin Panel"}
                  </button>
                )}

                {/* User badge */}
                <div className="flex items-center gap-1.5 px-3 py-1 bg-white/10 rounded-full ml-1">
                  <span className="text-sm">{user.role === "admin" ? "🛡️" : "👤"}</span>
                  <span className="text-indigo-100 text-sm font-medium max-w-[120px] truncate">
                    {user.name}
                  </span>
                </div>

                {/* Logout */}
                <button
                  onClick={handleLogout}
                  className="ml-1 px-3 py-1.5 bg-red-500 hover:bg-red-600 text-white text-sm font-bold rounded-md shadow-sm transition-colors"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                {navLink("/login",    "Login")}
                {navLink("/register", "Register")}
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
