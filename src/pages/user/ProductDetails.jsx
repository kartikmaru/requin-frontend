import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axiosInstance from "../../utils/axiosInstance";

const ProductDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [address, setAddress] = useState("");
  const [ordering, setOrdering] = useState(false);
  const [orderSuccess, setOrderSuccess] = useState("");
  const [orderError, setOrderError] = useState("");

  useEffect(() => {
    axiosInstance.get(`/api/products/${id}`)
      .then(({ data }) => setProduct(data))
      .catch(() => setError("Product not found"))
      .finally(() => setLoading(false));
  }, [id]);

  const handlePlaceOrder = async () => {
    setOrdering(true);
    setOrderError("");
    setOrderSuccess("");
    try {
      await axiosInstance.post("/api/orders", {
        items: [{ product: product._id, quantity }],
        shippingAddress: address,
      });
      setOrderSuccess("Order placed successfully! 🎉");
      setQuantity(1);
    } catch (err) {
      setOrderError(err.response?.data?.message || "Failed to place order");
    } finally {
      setOrdering(false);
    }
  };

  const inputCls = "w-full px-3.5 py-2.5 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent";

  if (loading) return (
    <div className="max-w-4xl mx-auto px-4 py-8 text-slate-500">Loading...</div>
  );
  if (error) return (
    <div className="max-w-4xl mx-auto px-4 py-8 text-red-500">{error}</div>
  );

  const inStock = product.stock > 0;

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
      <button
        onClick={() => navigate("/products")}
        className="mb-5 px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-sm font-semibold rounded-lg transition-colors"
      >
        ← Back to Products
      </button>

      <div className="bg-white rounded-2xl shadow-sm p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">

          {/* Image */}
          <div className="bg-slate-50 rounded-xl overflow-hidden flex items-center justify-center" style={{ minHeight: 280 }}>
            {product.image ? (
              <img
                src={product.image}
                alt={product.name}
                className="w-full h-72 object-contain p-4"
                onError={(e) => { e.target.style.display = "none"; }}
              />
            ) : (
              <div className="text-7xl text-slate-300">🛍️</div>
            )}
          </div>

          {/* Info */}
          <div className="flex flex-col">
            <h2 className="text-2xl font-bold text-slate-800 mb-1">{product.name}</h2>
            <p className="text-slate-400 text-sm mb-3">Category: {product.category}</p>
            <p className="text-slate-600 text-sm mb-4 leading-relaxed">{product.description}</p>

            <p className="text-3xl font-extrabold text-indigo-600 mb-2">
              ${product.price.toFixed(2)}
            </p>
            <p className={`text-sm font-medium mb-5 ${inStock ? "text-green-600" : "text-red-500"}`}>
              {inStock ? `✅ ${product.stock} in stock` : "❌ Out of stock"}
            </p>

            {inStock && (
              <div className="space-y-3">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1.5">Quantity</label>
                  <input
                    type="number" min="1" max={product.stock} value={quantity}
                    onChange={(e) => setQuantity(Math.min(parseInt(e.target.value) || 1, product.stock))}
                    className={`${inputCls} w-24`}
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1.5">Shipping Address</label>
                  <input
                    type="text" value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    placeholder="123 Main St, City"
                    className={inputCls}
                  />
                </div>

                <p className="font-semibold text-slate-700 text-sm">
                  Total:{" "}
                  <span className="text-indigo-600 font-extrabold">
                    ${(product.price * quantity).toFixed(2)}
                  </span>
                </p>

                {orderSuccess && <p className="text-green-600 text-sm font-medium">{orderSuccess}</p>}
                {orderError   && <p className="text-red-500 text-sm">{orderError}</p>}

                <button
                  onClick={handlePlaceOrder}
                  disabled={ordering}
                  className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-60 text-white font-semibold rounded-xl transition-colors mt-1"
                >
                  {ordering ? "Placing Order..." : "Place Order"}
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;
