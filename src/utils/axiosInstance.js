import axios from "axios";

/**
 * axiosInstance — single Axios instance for the entire app.
 *
 * baseURL logic:
 *   - Local dev: VITE_API_BASE_URL is empty → baseURL = ""
 *     Vite's dev proxy forwards every /api/* request to localhost:5000.
 *     The browser never sees a cross-origin request, so CORS is not an issue.
 *
 *   - Production: VITE_API_BASE_URL = "https://your-api.onrender.com"
 *     All API calls go directly to the deployed backend.
 *     The server's CORS config must allow the deployed frontend origin.
 *
 * WHY VITE_ prefix?
 *   Vite only exposes env variables that start with VITE_ to the browser bundle.
 *   Variables without this prefix stay server-side (build process only).
 *   NEVER put MONGO_URI / JWT_SECRET / DB passwords in client .env.
 */
const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || "",
  headers: { "Content-Type": "application/json" },
});

// ── Request Interceptor ────────────────────────────────────────────────────
// Auto-attach JWT Bearer token to every outgoing request.
// Reads from localStorage so the token is always fresh.
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

// ── Response Interceptor ───────────────────────────────────────────────────
// Handle expired / invalid tokens globally.
// 401 → clear storage + redirect to /login automatically.
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
