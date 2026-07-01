import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { client } from "../../api/client";

const AdminDashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [stats,   setStats]   = useState({ totalProducts: 0, totalOrders: 0, totalUsers: 0 });
  const [loading, setLoading] = useState(true);
  const [error,   setError]   = useState("");

  useEffect(() => {
    client.get("/api/admin/stats")
      .then(({ data }) => setStats(data.data))
      .catch(() => setError("Failed to load stats"))
      .finally(() => setLoading(false));
  }, []);

  const statCards = [
    { icon: "👥", value: stats.totalUsers,    label: "Total Users",    color: "text-rose-600"   },
    { icon: "🛍️", value: stats.totalProducts, label: "Total Products", color: "text-indigo-600" },
    { icon: "📦", value: stats.totalOrders,   label: "Total Orders",   color: "text-emerald-600" },
  ];

  const actionCards = [
    { to: "/admin/products/add", bg: "bg-indigo-600",  icon: "➕", label: "Add New Product"  },
    { to: "/admin/products",     bg: "bg-slate-900",   icon: "🛍️", label: "Manage Products"  },
    { to: "/admin/orders",       bg: "bg-emerald-700", icon: "📋", label: "View All Orders"   },
    { to: "/admin/products",     bg: "bg-violet-600",  icon: "📊", label: "Product Analytics" },
  ];

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8">

      <div className="bg-white rounded-2xl shadow-sm p-6 mb-6 flex items-center justify-between flex-wrap gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">🛡️ Admin Dashboard</h2>
          <p className="text-slate-500 text-sm mt-1">Welcome back, {user?.name}</p>
        </div>
        <button
          onClick={() => navigate("/dashboard")}
          className="flex items-center gap-2 px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-sm rounded-lg shadow-md transition-colors"
        >
          👤 User View
        </button>
      </div>

      {error ? (
        <div className="bg-white rounded-2xl shadow-sm p-6 mb-6 text-center text-red-500 text-sm">{error}</div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
          {statCards.map(({ icon, value, label, color }) => (
            <div key={label} className="bg-white rounded-2xl shadow-sm p-6 text-center">
              <div className="text-3xl mb-1">{icon}</div>
              <p className={`text-3xl font-extrabold mt-1 ${color}`}>
                {loading ? "—" : value}
              </p>
              <p className="font-semibold text-slate-700 mt-1">{label}</p>
            </div>
          ))}
        </div>
      )}

      <div className="grid grid-cols-2 gap-4">
        {actionCards.map((card) => (
          <Link key={card.label} to={card.to} className="block no-underline">
            <div className={`${card.bg} text-white rounded-2xl p-6 text-center hover:opacity-90 transition-opacity cursor-pointer`}>
              <div className="text-3xl mb-2">{card.icon}</div>
              <p className="font-semibold">{card.label}</p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default AdminDashboard;
