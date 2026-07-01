import { useState, useCallback } from "react";
import { client } from "../api/client";

const useOrders = () => {
  const [orders,       setOrders]       = useState([]);
  const [salesData,    setSalesData]    = useState([]);
  const [loading,      setLoading]      = useState(false);
  const [loadingSales, setLoadingSales] = useState(false);
  const [error,        setError]        = useState(null);

  const fetchOrders = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const { data } = await client.get("/api/orders");
      setOrders(data);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to fetch orders");
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchSalesByCategory = useCallback(async () => {
    setLoadingSales(true);
    setError(null);
    try {
      const { data } = await client.get("/api/orders/sales-by-category");
      setSalesData(data.data);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to fetch sales data");
    } finally {
      setLoadingSales(false);
    }
  }, []);

  const createOrder = useCallback(async (orderData) => {
    setLoading(true);
    setError(null);
    try {
      const { data } = await client.post("/api/orders", orderData);
      setOrders((prev) => [data, ...prev]);
      return data;
    } catch (err) {
      const msg = err.response?.data?.message || "Failed to create order";
      setError(msg);
      throw new Error(msg);
    } finally {
      setLoading(false);
    }
  }, []);

  return { orders, salesData, loading, loadingSales, error, fetchOrders, fetchSalesByCategory, createOrder };
};

export default useOrders;
