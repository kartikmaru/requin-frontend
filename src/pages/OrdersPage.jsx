import React, { useEffect, useState } from "react";
import useOrders from "../hooks/useOrders";
import Spinner from "../components/Spinner";

const STATUS_COLORS = {
  completed: { bg: "#dcfce7", color: "#16a34a" },
  cancelled:  { bg: "#fee2e2", color: "#dc2626" },
  pending:    { bg: "#fef9c3", color: "#ca8a04" },
};

const OrdersPage = () => {
  const { orders, salesData, loading, loadingSales, error, fetchOrders, fetchSalesByCategory, createOrder } = useOrders();
  const [activeTab,  setActiveTab]  = useState("orders");
  const [form,       setForm]       = useState({ product: "", category: "", amount: "", status: "completed" });
  const [formError,  setFormError]  = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  useEffect(() => { fetchOrders(); }, [fetchOrders]);
  useEffect(() => {
    if (activeTab === "analytics") fetchSalesByCategory();
  }, [activeTab, fetchSalesByCategory]);

  const handleChange = (e) => setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const handleCreate = async (e) => {
    e.preventDefault();
    setFormError("");
    setSuccessMsg("");
    if (!form.product || !form.category || !form.amount) return setFormError("All fields are required");
    try {
      await createOrder({ ...form, amount: parseFloat(form.amount) });
      setSuccessMsg("Order created successfully!");
      setForm({ product: "", category: "", amount: "", status: "completed" });
    } catch (err) {
      setFormError(err.message);
    }
  };

  const tabs = ["orders", "analytics", "create"];
  const inputCls = "w-full px-3.5 py-2.5 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500";

  if (loading) return <Spinner />;

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
      <h2 className="text-2xl font-bold text-slate-800 mb-6">Orders</h2>

      <div className="flex gap-2 mb-6 flex-wrap">
        {tabs.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2 rounded-lg font-semibold text-sm transition-colors ${
              activeTab === tab ? "bg-indigo-600 text-white" : "bg-slate-100 text-slate-700 hover:bg-slate-200"
            }`}
          >
            {tab.charAt(0).toUpperCase() + tab.slice(1)}
          </button>
        ))}
      </div>

      {activeTab === "orders" && (
        <div className="bg-white rounded-2xl shadow-sm p-5">
          <h3 className="font-semibold text-slate-700 mb-4">My Orders</h3>
          {error ? (
            <p className="text-red-500 text-sm">{error}</p>
          ) : orders.length === 0 ? (
            <p className="text-slate-500">No orders yet. Create one!</p>
          ) : (
            <div className="table-scroll">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-slate-200">
                    {["Product","Category","Amount","Status","Date"].map((h) => (
                      <th key={h} className="text-left px-3 py-2.5 text-xs font-semibold text-slate-500 uppercase bg-slate-50">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {orders.map((order) => (
                    <tr key={order._id} className="border-b border-slate-50 last:border-0">
                      <td className="px-3 py-2.5 text-slate-700">{order.product}</td>
                      <td className="px-3 py-2.5 text-slate-500">{order.category}</td>
                      <td className="px-3 py-2.5 font-semibold text-indigo-600">${order.amount?.toFixed(2)}</td>
                      <td className="px-3 py-2.5">
                        <span className="px-2 py-0.5 rounded-full text-xs font-semibold" style={{
                          background: STATUS_COLORS[order.status]?.bg,
                          color:      STATUS_COLORS[order.status]?.color,
                        }}>
                          {order.status}
                        </span>
                      </td>
                      <td className="px-3 py-2.5 text-slate-500">{new Date(order.createdAt).toLocaleDateString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {activeTab === "analytics" && (
        <div className="bg-white rounded-2xl shadow-sm p-5">
          <h3 className="font-semibold text-slate-700 mb-1">Sales by Category</h3>
          <p className="text-slate-400 text-xs mb-4">MongoDB Aggregation: $match → $group → $sort → $project</p>
          {loadingSales ? (
            <p className="text-slate-500">Running pipeline...</p>
          ) : error ? (
            <p className="text-red-500 text-sm">{error}</p>
          ) : salesData.length === 0 ? (
            <p className="text-slate-500">No completed orders found.</p>
          ) : (
            <div className="table-scroll">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-slate-200">
                    {["Category","Total Sales","Orders","Avg Value"].map((h) => (
                      <th key={h} className="text-left px-3 py-2.5 text-xs font-semibold text-slate-500 uppercase bg-slate-50">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {salesData.map((row) => (
                    <tr key={row.category} className="border-b border-slate-50 last:border-0">
                      <td className="px-3 py-2.5 font-semibold text-slate-700">{row.category}</td>
                      <td className="px-3 py-2.5 font-semibold text-green-600">${row.totalSales?.toFixed(2)}</td>
                      <td className="px-3 py-2.5 text-slate-500">{row.orderCount}</td>
                      <td className="px-3 py-2.5 text-slate-500">${row.avgOrderValue}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {activeTab === "create" && (
        <div className="bg-white rounded-2xl shadow-sm p-6 max-w-lg">
          <h3 className="font-semibold text-slate-700 mb-4">Create New Order</h3>
          <form onSubmit={handleCreate} className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1.5">Product Name</label>
              <input type="text" name="product" value={form.product} onChange={handleChange} placeholder="e.g., iPhone 15" className={inputCls} />
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1.5">Category</label>
              <input type="text" name="category" value={form.category} onChange={handleChange} placeholder="e.g., Electronics" className={inputCls} />
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1.5">Amount ($)</label>
              <input type="number" name="amount" value={form.amount} onChange={handleChange} placeholder="e.g., 999.99" min="0" step="0.01" className={inputCls} />
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1.5">Status</label>
              <select name="status" value={form.status} onChange={handleChange} className={inputCls}>
                <option value="pending">Pending</option>
                <option value="completed">Completed</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>
            {formError  && <p className="text-red-500 text-sm">{formError}</p>}
            {successMsg && <p className="text-green-600 text-sm">{successMsg}</p>}
            <button type="submit" disabled={loading} className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-60 text-white font-semibold rounded-lg transition-colors">
              {loading ? "Creating..." : "Create Order"}
            </button>
          </form>
        </div>
      )}
    </div>
  );
};

export default OrdersPage;
