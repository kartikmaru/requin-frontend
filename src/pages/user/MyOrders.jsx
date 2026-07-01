import React, { useEffect, useState } from "react";
import { client } from "../../api/client";
import Spinner from "../../components/Spinner";

const STATUS_STYLES = {
  pending:    "bg-yellow-100 text-yellow-800",
  processing: "bg-blue-100 text-blue-800",
  shipped:    "bg-indigo-100 text-indigo-800",
  delivered:  "bg-green-100 text-green-800",
  cancelled:  "bg-red-100 text-red-600",
};

const MyOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState("");

  useEffect(() => {
    client.get("/api/orders/my")
      .then(({ data }) => setOrders(data))
      .catch((err) => setError(err.response?.data?.message || "Failed to load orders"))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <Spinner />;

  if (error) return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <div className="bg-white rounded-2xl shadow-sm p-8 text-center text-red-500">{error}</div>
    </div>
  );

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8">
      <h2 className="text-2xl font-bold text-slate-800 mb-6">
        📦 My Orders <span className="text-slate-400 text-lg font-normal">({orders.length})</span>
      </h2>

      {orders.length === 0 ? (
        <div className="bg-white rounded-2xl shadow-sm p-10 text-center">
          <div className="text-4xl mb-3">📭</div>
          <p className="text-slate-500">You haven't placed any orders yet.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => (
            <div key={order._id} className="bg-white rounded-2xl shadow-sm border-l-4 border-indigo-400 p-5">
              <div className="flex items-start justify-between flex-wrap gap-3 mb-4">
                <div>
                  <p className="text-xs text-slate-400 font-mono">#{order._id}</p>
                  <p className="text-sm text-slate-500 mt-0.5">
                    Placed on {new Date(order.createdAt).toLocaleDateString()}
                  </p>
                </div>
                <div className="flex gap-2 flex-wrap">
                  <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold ${STATUS_STYLES[order.status] || "bg-gray-100 text-gray-700"}`}>
                    {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                  </span>
                  <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold ${order.paymentStatus === "paid" ? "bg-green-100 text-green-700" : "bg-orange-100 text-orange-700"}`}>
                    {order.paymentStatus === "paid" ? "Paid" : "Unpaid"}
                  </span>
                </div>
              </div>

              <div className="table-scroll">
                <table className="w-full text-sm mb-3">
                  <thead>
                    <tr className="border-b border-slate-100">
                      <th className="text-left py-2 px-3 text-xs font-semibold text-slate-500 uppercase bg-slate-50">Product</th>
                      <th className="text-center py-2 px-3 text-xs font-semibold text-slate-500 uppercase bg-slate-50">Qty</th>
                      <th className="text-right py-2 px-3 text-xs font-semibold text-slate-500 uppercase bg-slate-50">Price</th>
                      <th className="text-right py-2 px-3 text-xs font-semibold text-slate-500 uppercase bg-slate-50">Subtotal</th>
                    </tr>
                  </thead>
                  <tbody>
                    {(order.items || []).map((item, i) => (
                      <tr key={i} className="border-b border-slate-50 last:border-0">
                        <td className="py-2.5 px-3 text-slate-700">{item.name}</td>
                        <td className="py-2.5 px-3 text-center text-slate-500">{item.quantity}</td>
                        <td className="py-2.5 px-3 text-right text-slate-500">${item.price.toFixed(2)}</td>
                        <td className="py-2.5 px-3 text-right font-semibold text-slate-700">${(item.price * item.quantity).toFixed(2)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="flex items-center justify-between pt-3 border-t border-slate-100">
                {order.shippingAddress ? <p className="text-slate-500 text-xs">📍 {order.shippingAddress}</p> : <span />}
                <p className="font-bold text-indigo-600">Total: ${(order.totalAmount || 0).toFixed(2)}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyOrders;
