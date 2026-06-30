import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const DashboardPage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8">

      {/* Welcome Banner */}
      <div className="bg-white rounded-2xl shadow-sm p-6 mb-6 flex items-center justify-between flex-wrap gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">Welcome, {user?.name} 👋</h2>
          <p className="text-slate-500 text-sm mt-1">Your personal dashboard</p>
        </div>

        {/* Admin Panel button — admin only */}
        {user?.role === "admin" && (
          <button
            onClick={() => navigate("/admin/dashboard")}
            className="flex items-center gap-2 px-5 py-2.5 bg-slate-900 hover:bg-slate-700 text-white font-bold text-sm rounded-lg shadow-md transition-colors"
          >
            🛡️ Admin Panel
          </button>
        )}
      </div>

      {/* Quick Links */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        <Link to="/products" className="block no-underline group">
          <div className="bg-white rounded-2xl shadow-sm p-6 text-center hover:-translate-y-1 hover:shadow-md transition-all cursor-pointer">
            <div className="text-4xl mb-3">🛍️</div>
            <p className="font-semibold text-slate-800">Browse Products</p>
            <p className="text-slate-400 text-xs mt-1">View all available products</p>
          </div>
        </Link>

        <Link to="/my-orders" className="block no-underline group">
          <div className="bg-white rounded-2xl shadow-sm p-6 text-center hover:-translate-y-1 hover:shadow-md transition-all cursor-pointer">
            <div className="text-4xl mb-3">📦</div>
            <p className="font-semibold text-slate-800">My Orders</p>
            <p className="text-slate-400 text-xs mt-1">Track your orders</p>
          </div>
        </Link>

        <div className="bg-white rounded-2xl shadow-sm p-6 text-center">
          <div className="text-4xl mb-3">👤</div>
          <p className="font-semibold text-slate-800">Profile</p>
          <p className="text-slate-400 text-xs mt-1 truncate">{user?.email}</p>
        </div>
      </div>

      {/* Account Info */}
      <div className="bg-white rounded-2xl shadow-sm p-6">
        <h3 className="font-semibold text-slate-700 mb-4">Account Info</h3>
        <table className="w-full text-sm">
          <tbody>
            <tr className="border-b border-slate-100">
              <td className="py-2.5 pr-4 font-semibold text-slate-600 w-24">Name</td>
              <td className="py-2.5 text-slate-800">{user?.name}</td>
            </tr>
            <tr className="border-b border-slate-100">
              <td className="py-2.5 pr-4 font-semibold text-slate-600">Email</td>
              <td className="py-2.5 text-slate-800">{user?.email}</td>
            </tr>
            <tr>
              <td className="py-2.5 pr-4 font-semibold text-slate-600">Role</td>
              <td className="py-2.5">
                <span className={`inline-block px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                  user?.role === "admin"
                    ? "bg-indigo-100 text-indigo-700"
                    : "bg-green-100 text-green-700"
                }`}>
                  {user?.role === "admin" ? "🛡️ Admin" : "👤 User"}
                </span>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default DashboardPage;
