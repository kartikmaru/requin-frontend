import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { client } from "../../api/client";

const inputCls = "w-full px-3.5 py-2.5 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent";
const labelCls = "block text-sm font-semibold text-slate-700 mb-1.5";

const AddProduct = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: "", description: "", price: "", category: "", image: "", stock: "" });
  const [error, setError]     = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await client.post("/api/products", {
        ...form,
        price: parseFloat(form.price),
        stock: parseInt(form.stock) || 0,
      });
      navigate("/admin/products");
    } catch (err) {
      setError(err.response?.data?.message || "Failed to create product");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 py-8">
      <div className="bg-white rounded-2xl shadow-sm p-8">
        <h2 className="text-xl font-bold text-slate-800 mb-6">➕ Add New Product</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className={labelCls}>Product Name</label>
            <input name="name" value={form.name} onChange={handleChange} placeholder="e.g., iPhone 15" required className={inputCls} />
          </div>
          <div>
            <label className={labelCls}>Description</label>
            <textarea name="description" value={form.description} onChange={handleChange} placeholder="Product description..." required rows={3} className={`${inputCls} resize-none`} />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className={labelCls}>Price ($)</label>
              <input name="price" type="number" value={form.price} onChange={handleChange} placeholder="999.99" min="0" step="0.01" required className={inputCls} />
            </div>
            <div>
              <label className={labelCls}>Stock</label>
              <input name="stock" type="number" value={form.stock} onChange={handleChange} placeholder="100" min="0" className={inputCls} />
            </div>
          </div>
          <div>
            <label className={labelCls}>Category</label>
            <input name="category" value={form.category} onChange={handleChange} placeholder="e.g., Electronics" required className={inputCls} />
          </div>
          <div>
            <label className={labelCls}>Image URL <span className="text-slate-400 font-normal">(optional)</span></label>
            <input name="image" value={form.image} onChange={handleChange} placeholder="https://..." className={inputCls} />
          </div>
          {error && <p className="text-sm text-red-600">{error}</p>}
          <div className="flex gap-3 pt-2">
            <button type="submit" disabled={loading} className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-60 text-white font-semibold rounded-lg transition-colors">
              {loading ? "Saving..." : "Add Product"}
            </button>
            <button type="button" onClick={() => navigate("/admin/products")} className="px-6 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded-lg transition-colors">
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddProduct;
