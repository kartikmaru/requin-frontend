import React from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const UnauthorizedPage = () => {
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-slate-100 flex items-center justify-center px-4">
      <div className="bg-white rounded-2xl shadow-lg p-10 text-center max-w-sm w-full">
        <div className="text-5xl mb-4">🚫</div>
        <h2 className="text-2xl font-bold text-slate-800 mb-2">Access Denied</h2>
        <p className="text-slate-500 mb-6">You don't have permission to view this page.</p>
        <Link
          to={user?.role === "admin" ? "/admin/dashboard" : "/dashboard"}
          className="inline-block px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-lg transition-colors"
        >
          Go to Dashboard
        </Link>
      </div>
    </div>
  );
};

export default UnauthorizedPage;
