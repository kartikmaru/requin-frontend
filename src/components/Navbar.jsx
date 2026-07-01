import React, { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate  = useNavigate();
  const location  = useLocation();
  const [open, setOpen] = useState(false);

  const isAdminView = location.pathname.startsWith("/admin");

  const handleLogout = () => {
    setOpen(false);
    logout();
    navigate("/login");
  };

  const handleNav = (path) => {
    setOpen(false);
    navigate(path);
  };

  const navLinkCls = (to) => {
    const active = location.pathname === to;
    return `block px-3 py-2 rounded-md text-sm font-medium transition-colors ${
      active
        ? "bg-white/20 text-white font-semibold"
        : "text-indigo-200 hover:text-white hover:bg-white/10"
    }`;
  };

  const userLinks = !isAdminView
    ? [{ to: "/dashboard", label: "Dashboard" }, { to: "/products", label: "Products" }, { to: "/my-orders", label: "My Orders" }]
    : [{ to: "/admin/dashboard", label: "Home" }, { to: "/admin/products", label: "Products" }, { to: "/admin/orders", label: "Orders" }];

  const guestLinks = [{ to: "/login", label: "Login" }, { to: "/register", label: "Register" }];
  const links = user ? userLinks : guestLinks;

  return (
    <nav className="sticky top-0 z-50 bg-indigo-600 shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-14">

          <Link
            to={user ? "/dashboard" : "/login"}
            className="text-white font-extrabold text-lg tracking-tight shrink-0 flex items-center gap-1.5"
          >
            <span>⚡</span> MERN App
          </Link>

          <div className="hidden md:flex items-center gap-1.5">
            {links.map(({ to, label }) => (
              <Link key={to} to={to} className={navLinkCls(to)}>{label}</Link>
            ))}

            {user?.role === "admin" && (
              <button
                onClick={() => navigate(isAdminView ? "/dashboard" : "/admin/dashboard")}
                className={`ml-1 px-3 py-1.5 rounded-md text-sm font-bold text-white border border-white/25 transition-colors ${
                  isAdminView ? "bg-indigo-700 hover:bg-indigo-800" : "bg-slate-900/70 hover:bg-slate-900"
                }`}
              >
                {isAdminView ? "👤 User View" : "🛡️ Admin Panel"}
              </button>
            )}

            {user && (
              <>
                <div className="flex items-center gap-1.5 px-3 py-1 bg-white/10 rounded-full ml-1">
                  <span className="text-sm">{user.role === "admin" ? "🛡️" : "👤"}</span>
                  <span className="text-indigo-100 text-sm font-medium truncate max-w-[120px]">{user.name}</span>
                </div>
                <button
                  onClick={handleLogout}
                  className="ml-1 px-3 py-1.5 bg-red-500 hover:bg-red-600 text-white text-sm font-bold rounded-md transition-colors"
                >
                  Logout
                </button>
              </>
            )}
          </div>

          <button
            onClick={() => setOpen(!open)}
            className="md:hidden flex flex-col justify-center items-center w-8 h-8 gap-1.5 rounded focus:outline-none"
            aria-label="Toggle menu"
          >
            <span className={`block w-5 h-0.5 bg-white transition-transform duration-200 ${open ? "rotate-45 translate-y-2" : ""}`} />
            <span className={`block w-5 h-0.5 bg-white transition-opacity duration-200 ${open ? "opacity-0" : ""}`} />
            <span className={`block w-5 h-0.5 bg-white transition-transform duration-200 ${open ? "-rotate-45 -translate-y-2" : ""}`} />
          </button>
        </div>
      </div>

      {open && (
        <div className="md:hidden bg-indigo-700 px-4 pb-4 pt-2 space-y-1">
          {links.map(({ to, label }) => (
            <Link key={to} to={to} onClick={() => setOpen(false)} className={navLinkCls(to)}>
              {label}
            </Link>
          ))}

          {user?.role === "admin" && (
            <button
              onClick={() => handleNav(isAdminView ? "/dashboard" : "/admin/dashboard")}
              className="w-full text-left px-3 py-2 rounded-md text-sm font-bold text-white bg-slate-900/60 hover:bg-slate-900 transition-colors"
            >
              {isAdminView ? "👤 User View" : "🛡️ Admin Panel"}
            </button>
          )}

          {user && (
            <div className="pt-2 border-t border-white/20 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-sm">{user.role === "admin" ? "🛡️" : "👤"}</span>
                <span className="text-indigo-100 text-sm font-medium truncate max-w-[160px]">{user.name}</span>
              </div>
              <button
                onClick={handleLogout}
                className="px-3 py-1.5 bg-red-500 hover:bg-red-600 text-white text-xs font-bold rounded-md transition-colors"
              >
                Logout
              </button>
            </div>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;
