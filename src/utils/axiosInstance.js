import axios from "axios";

// Single axios instance used across the entire app.
// Centralises base URL and auth header logic in one place.
const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "",
  headers: { "Content-Type": "application/json" },
});

// Request Interceptor — auto-attach JWT to every outgoing request
// Reads the token fresh from localStorage on each call
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers["Authorization"] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response Interceptor — handle expired/invalid token globally
// If server returns 401, clear storage and redirect to login
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      delete axiosInstance.defaults.headers.common["Authorization"];
      if (window.location.pathname !== "/login") {
        window.location.href = "/login";
      }
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;
