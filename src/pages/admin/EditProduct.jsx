import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axiosInstance from "../../utils/axiosInstance";

const EditProduct = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: "", description: "", price: "", category: "", image: "", stock: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);

  useEffect(() => {
    axiosInstance.get(`/api/products/${id}`)
      .then(({ data }) => setForm({
        name: data.name, description: data.description, price: data.price,
        category: data.category, image: data.image || "", stock: data.stock,
      }))
      .catch(() => setError("Failed to load product"))
      .finally(() => setFetching(false));
  }, [id]);

  const handleChange = (e) =>
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await axiosInstance.put(`/api/products/${id}`, {
        ...form,
        price: parseFloat(form.price),
        stock: parseInt(form.stock) || 0,
      });
      navigate("/admin/products");
    } catch (err) {
      setError(err.response?.data?.message || "Update failed");
    } finally {
      setLoading(false);
    }
  };

  const inputCls = "w-full px-3.5 py-2.5 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent";
  const labelCls = "block text-sm font-semibold text-slate-700 mb-1.5";

  if (fetching) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-8">
        <div className="bg-white rounded-2xl shadow-sm p-8 text-center text-slate-500">Loading...</div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 py-8">
      <div className="bg-white rounded-2xl shadow-sm p-8">
        <h2 className="text-xl font-bold text-slate-800 mb-6">✏️ Edit Product</h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className={labelCls}>Product Name</label>
            <input name="name" value={form.name} onChange={handleChange} required className={inputCls} />
          </div>

          <div>
            <label className={labelCls}>Description</label>
            <textarea
              name="description" value={form.description} onChange={handleChange} required rows={3}
              className={`${inputCls} resize-none`}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className={labelCls}>Price ($)</label>
              <input name="price" type="number" value={form.price} onChange={handleChange}
                min="0" step="0.01" required className={inputCls} />
            </div>
            <div>
              <label className={labelCls}>Stock</label>
              <input name="stock" type="number" value={form.stock} onChange={handleChange}
                min="0" className={inputCls} />
            </div>
          </div>

          <div>
            <label className={labelCls}>Category</label>
            <input name="category" value={form.category} onChange={handleChange} required className={inputCls} />
          </div>

          <div>
            <label className={labelCls}>Image URL</label>
            <input name="image" value={form.image} onChange={handleChange}
              placeholder="https://..." className={inputCls} />
          </div>

          {error && <p className="text-sm text-red-600">{error}</p>}

          <div className="flex gap-3 pt-2">
            <button
              type="submit" disabled={loading}
              className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-60 text-white font-semibold rounded-lg transition-colors"
            >
              {loading ? "Saving..." : "Save Changes"}
            </button>
            <button
              type="button"
              onClick={() => navigate("/admin/products")}
              className="px-6 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded-lg transition-colors"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditProduct;
