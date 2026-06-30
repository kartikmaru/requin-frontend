import React, { useEffect, useState } from "react";
import useOrders from "../hooks/useOrders";

const STATUS_COLORS = {
  completed: { bg: "#dcfce7", color: "#16a34a" },
  cancelled:  { bg: "#fee2e2", color: "#dc2626" },
  pending:    { bg: "#fef9c3", color: "#ca8a04" },
};

const OrdersPage = () => {
  const { orders, salesData, loading, loadingSales, error, fetchOrders, fetchSalesByCategory, createOrder } = useOrders();
  const [activeTab, setActiveTab] = useState("orders");
  const [form, setForm] = useState({ product: "", category: "", amount: "", status: "completed" });
  const [formError, setFormError] = useState("");
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

  return (
    <div className="container" style={{ marginTop: 30 }}>
      <h2 style={{ marginBottom: 20 }}>Orders</h2>

      {/* Tab Bar */}
      <div style={{ display: "flex", gap: 8, marginBottom: 20 }}>
        {tabs.map((tab) => (
          <button key={tab} onClick={() => setActiveTab(tab)} style={{
            padding: "8px 18px", border: "none", borderRadius: 4, cursor: "pointer", fontWeight: 600,
            background: activeTab === tab ? "#4f46e5" : "#e5e7eb",
            color: activeTab === tab ? "#fff" : "#333",
          }}>
            {tab.charAt(0).toUpperCase() + tab.slice(1)}
          </button>
        ))}
      </div>

      {/* Orders List */}
      {activeTab === "orders" && (
        <div className="card">
          <h3 style={{ marginBottom: 16 }}>My Orders</h3>
          {loading ? <p>Loading orders...</p> : error ? <p className="error">{error}</p> : orders.length === 0 ? (
            <p style={{ color: "#666" }}>No orders yet. Create one!</p>
          ) : (
            <table>
              <thead>
                <tr><th>Product</th><th>Category</th><th>Amount</th><th>Status</th><th>Date</th></tr>
              </thead>
              <tbody>
                {orders.map((order) => (
                  <tr key={order._id}>
                    <td>{order.product}</td>
                    <td>{order.category}</td>
                    <td>${order.amount.toFixed(2)}</td>
                    <td>
                      <span style={{
                        padding: "2px 8px", borderRadius: 99, fontSize: 12, fontWeight: 600,
                        background: STATUS_COLORS[order.status]?.bg,
                        color: STATUS_COLORS[order.status]?.color,
                      }}>
                        {order.status}
                      </span>
                    </td>
                    <td>{new Date(order.createdAt).toLocaleDateString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      )}

      {/* Aggregation Results */}
      {activeTab === "analytics" && (
        <div className="card">
          <h3 style={{ marginBottom: 4 }}>Sales by Category</h3>
          <p style={{ color: "#666", fontSize: 13, marginBottom: 16 }}>
            MongoDB Aggregation: $match → $group → $sort → $project
          </p>
          {loadingSales ? <p>Running pipeline...</p> : error ? <p className="error">{error}</p> : salesData.length === 0 ? (
            <p style={{ color: "#666" }}>No completed orders found.</p>
          ) : (
            <table>
              <thead>
                <tr><th>Category</th><th>Total Sales</th><th>Orders</th><th>Avg Value</th></tr>
              </thead>
              <tbody>
                {salesData.map((row) => (
                  <tr key={row.category}>
                    <td><strong>{row.category}</strong></td>
                    <td style={{ color: "#16a34a", fontWeight: 600 }}>${row.totalSales.toFixed(2)}</td>
                    <td>{row.orderCount}</td>
                    <td>${row.avgOrderValue}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      )}

      {/* Create Order Form */}
      {activeTab === "create" && (
        <div className="card" style={{ maxWidth: 500 }}>
          <h3 style={{ marginBottom: 16 }}>Create New Order</h3>
          <form onSubmit={handleCreate}>
            <div className="form-group">
              <label>Product Name</label>
              <input type="text" name="product" value={form.product} onChange={handleChange} placeholder="e.g., iPhone 15" />
            </div>
            <div className="form-group">
              <label>Category</label>
              <input type="text" name="category" value={form.category} onChange={handleChange} placeholder="e.g., Electronics" />
            </div>
            <div className="form-group">
              <label>Amount ($)</label>
              <input type="number" name="amount" value={form.amount} onChange={handleChange} placeholder="e.g., 999.99" min="0" step="0.01" />
            </div>
            <div className="form-group">
              <label>Status</label>
              <select name="status" value={form.status} onChange={handleChange}
                style={{ width: "100%", padding: "10px 12px", border: "1px solid #d1d5db", borderRadius: 4 }}>
                <option value="pending">Pending</option>
                <option value="completed">Completed</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>
            {formError && <p className="error">{formError}</p>}
            {successMsg && <p className="success">{successMsg}</p>}
            <button type="submit" className="btn btn-primary" disabled={loading}>
              {loading ? "Creating..." : "Create Order"}
            </button>
          </form>
        </div>
      )}
    </div>
  );
};

export default OrdersPage;
