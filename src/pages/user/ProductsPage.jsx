import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axiosInstance from "../../utils/axiosInstance";

const ProductsPage = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    axiosInstance.get("/api/products")
      .then(({ data }) => setProducts(data))
      .catch((err) => setError(err.response?.data?.message || "Failed to load products"))
      .finally(() => setLoading(false));
  }, []);

  const filtered = products.filter(
    (p) =>
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.category.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-3 mb-6">
        <h2 className="text-2xl font-bold text-slate-800">🛍️ Products</h2>
        <input
          type="text"
          placeholder="Search by name or category..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="px-3.5 py-2 border border-slate-200 rounded-lg text-sm w-60 focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />
      </div>

      {loading ? (
        <div className="bg-white rounded-2xl shadow-sm p-8 text-center text-slate-500">
          Loading products...
        </div>
      ) : error ? (
        <div className="bg-white rounded-2xl shadow-sm p-8 text-center text-red-500">{error}</div>
      ) : filtered.length === 0 ? (
        <div className="bg-white rounded-2xl shadow-sm p-8 text-center text-slate-500">
          No products found.
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
          {filtered.map((product) => (
            <ProductCard key={product._id} product={product} navigate={navigate} />
          ))}
        </div>
      )}
    </div>
  );
};

/* ── Product Card ─────────────────────────────────────────────────────── */
const ProductCard = ({ product, navigate }) => {
  const inStock = product.stock > 0;

  return (
    <div className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all flex flex-col">

      {/* Image container — fixed 4:3 ratio */}
      <div className="relative w-full bg-slate-100" style={{ aspectRatio: "4/3" }}>
        {product.image ? (
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-full object-contain p-2 transition-transform duration-300 hover:scale-105"
            onError={(e) => { e.target.style.display = "none"; }}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-5xl text-slate-300">
            🛍️
          </div>
        )}

        {/* Category badge */}
        {product.category && (
          <span className="absolute top-2 left-2 bg-indigo-600/90 text-white text-xs font-semibold px-2.5 py-0.5 rounded-full">
            {product.category}
          </span>
        )}

        {/* Out of stock overlay */}
        {!inStock && (
          <div className="absolute inset-0 bg-black/35 flex items-center justify-center">
            <span className="bg-red-500 text-white text-xs font-bold px-3 py-1 rounded-full">
              Out of Stock
            </span>
          </div>
        )}
      </div>

      {/* Card body */}
      <div className="p-4 flex flex-col flex-1">
        {/* Name — 2-line clamp */}
        <p className="font-semibold text-slate-800 text-sm leading-snug mb-1.5 line-clamp-2">
          {product.name}
        </p>

        {/* Stock */}
        <p className={`text-xs font-medium mb-3 ${inStock ? "text-green-600" : "text-red-500"}`}>
          {inStock ? `✅ ${product.stock} in stock` : "❌ Out of stock"}
        </p>

        {/* Price */}
        <p className="text-xl font-extrabold text-indigo-600 mt-auto mb-3">
          ${product.price.toFixed(2)}
        </p>

        {/* Buttons */}
        <div className="flex gap-2">
          <Link
            to={`/products/${product._id}`}
            className="flex-1 text-center py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold rounded-lg transition-colors no-underline"
          >
            View Details
          </Link>
          {inStock && (
            <button
              onClick={() => navigate(`/products/${product._id}`)}
              className="flex-1 py-2 bg-green-50 hover:bg-green-100 text-green-700 border border-green-200 text-xs font-semibold rounded-lg transition-colors"
            >
              🛒 Order
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductsPage;
