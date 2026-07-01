import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { client } from "../../api/client";
import Spinner from "../../components/Spinner";

const STATUS_STYLES = {
  pending:    "bg-yellow-100 text-yellow-800 border-yellow-200",
  processing: "bg-blue-100 text-blue-800 border-blue-200",
  shipped:    "bg-indigo-100 text-indigo-800 border-indigo-200",
  delivered:  "bg-green-100 text-green-800 border-green-200",
  cancelled:  "bg-red-100 text-red-800 border-red-200",
};

const PAYMENT_STYLES = {
  unpaid: "bg-orange-100 text-orange-800 border-orange-200",
  paid:   "bg-green-100 text-green-800 border-green-200",
};

const AdminOrders = () => {
  const [orders, setOrders]       = useState([]);
  const [loading, setLoading]     = useState(true);
  const [error, setError]         = useState("");
  const [updatingId, setUpdatingId] = useState(null);

  useEffect(() => {
    client.get("/api/orders/admin")
      .then(({ data }) => {
        setOrders(data.map((o) => ({
          ...o,
          items:       Array.isArray(o.items) ? o.items : [],
          totalAmount: typeof o.totalAmount === "number" ? o.totalAmount : (o.amount || 0),
        })));
      })
      .catch((err) => setError(err.response?.data?.message || err.message || "Failed to fetch orders"))
      .finally(() => setLoading(false));
  }, []);

  const handleStatusUpdate = async (orderId, field, value) => {
    setUpdatingId(orderId);
    try {
      const { data } = await client.put(`/api/orders/${orderId}/status`, { [field]: value });
      setOrders((prev) => prev.map((o) => o._id === orderId
        ? { ...data, items: Array.isArray(data.items) ? data.items : [], totalAmount: data.totalAmount || 0 }
        : o
      ));
    } catch (err) {
      alert(err.response?.data?.message || "Update failed");
    } finally {
      setUpdatingId(null);
    }
  };

  if (loading) return <Spinner />;

  if (error) {
    return (
      <div className="max-w-5xl mx-auto px-4 py-8">
        <div className="bg-white rounded-2xl shadow-sm p-12 text-center">
          <div className="text-4xl mb-3">❌</div>
          <p className="font-semibold text-red-600 mb-2">Failed to load orders</p>
          <p className="text-slate-500 text-sm mb-5">{error}</p>
          <button onClick={() => window.location.reload()} className="px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-lg transition-colors">
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8">
      <div className="flex items-center justify-between flex-wrap gap-3 mb-6">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">📋 All Orders</h2>
          <p className="text-slate-500 text-sm mt-1">{orders.length} order{orders.length !== 1 ? "s" : ""} total</p>
        </div>
        <Link to="/admin/dashboard" className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-sm rounded-lg transition-colors">
          ← Back to Dashboard
        </Link>
      </div>

      {orders.length === 0 ? (
        <div className="bg-white rounded-2xl shadow-sm p-12 text-center">
          <div className="text-4xl mb-3">📭</div>
          <p className="text-slate-500">No orders have been placed yet.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => (
            <div key={order._id} className="bg-white rounded-2xl shadow-sm border-l-4 border-indigo-500 p-5 hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between flex-wrap gap-3 mb-4">
                <div>
                  <p className="font-bold text-slate-800">
                    Order <span className="font-mono tracking-wide text-indigo-600">#{order._id.slice(-8).toUpperCase()}</span>
                  </p>
                  <p className="text-slate-500 text-sm mt-0.5">
                    👤 <span className="font-medium text-slate-700">{order.user?.name || "Unknown"}</span>
                    {order.user?.email ? ` · ${order.user.email}` : ""}
                    {" · "}{new Date(order.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
                  </p>
                </div>
                <div className="flex items-center gap-2 flex-wrap">
                  <select
                    value={order.status}
                    disabled={updatingId === order._id}
                    onChange={(e) => handleStatusUpdate(order._id, "status", e.target.value)}
                    className={`px-2.5 py-1.5 rounded-lg border text-xs font-semibold cursor-pointer focus:outline-none disabled:opacity-60 ${STATUS_STYLES[order.status] || "bg-gray-100 text-gray-700 border-gray-200"}`}
                  >
                    {["pending","processing","shipped","delivered","cancelled"].map((s) => (
                      <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>
                    ))}
                  </select>
                  <select
                    value={order.paymentStatus || "unpaid"}
                    disabled={updatingId === order._id}
                    onChange={(e) => handleStatusUpdate(order._id, "paymentStatus", e.target.value)}
                    className={`px-2.5 py-1.5 rounded-lg border text-xs font-semibold cursor-pointer focus:outline-none disabled:opacity-60 ${PAYMENT_STYLES[order.paymentStatus || "unpaid"] || "bg-gray-100 text-gray-700 border-gray-200"}`}
                  >
                    <option value="unpaid">Unpaid</option>
                    <option value="paid">Paid</option>
                  </select>
                  {updatingId === order._id && <span className="text-xs text-slate-400">Saving...</span>}
                </div>
              </div>

              {order.items.length > 0 ? (
                <div className="table-scroll">
                  <table className="w-full text-sm mb-3">
                    <thead>
                      <tr>
                        <th className="text-left py-2 px-3 bg-slate-50 text-slate-500 text-xs uppercase font-semibold border-b border-slate-200">Product</th>
                        <th className="text-center py-2 px-3 bg-slate-50 text-slate-500 text-xs uppercase font-semibold border-b border-slate-200">Qty</th>
                        <th className="text-right py-2 px-3 bg-slate-50 text-slate-500 text-xs uppercase font-semibold border-b border-slate-200">Unit Price</th>
                        <th className="text-right py-2 px-3 bg-slate-50 text-slate-500 text-xs uppercase font-semibold border-b border-slate-200">Subtotal</th>
                      </tr>
                    </thead>
                    <tbody>
                      {order.items.map((item, i) => (
                        <tr key={i} className="border-b border-slate-50 last:border-0">
                          <td className="py-2.5 px-3 text-slate-700">{item.name || "—"}</td>
                          <td className="py-2.5 px-3 text-center text-slate-600">{item.quantity}</td>
                          <td className="py-2.5 px-3 text-right text-slate-600">${(item.price || 0).toFixed(2)}</td>
                          <td className="py-2.5 px-3 text-right font-semibold text-slate-800">${((item.price || 0) * (item.quantity || 1)).toFixed(2)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <p className="text-slate-400 text-sm mb-3">No items data available.</p>
              )}

              <div className="flex items-center justify-between pt-3 border-t border-slate-100">
                {order.shippingAddress ? <p className="text-slate-500 text-sm">📍 {order.shippingAddress}</p> : <span />}
                <p className="font-bold text-indigo-600 text-base">Total: ${(order.totalAmount || 0).toFixed(2)}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AdminOrders;
