/**
 * client.js — Canonical API client for the entire frontend.
 *
 * Exported as `client` (named export) so usage is clean:
 *   import { client } from "../api/client";
 *   client.get("/api/products")
 *
 * BASE URL LOGIC:
 *   Local dev  → VITE_API_BASE_URL is empty in .env
 *                Vite proxy forwards /api/* → localhost:5000
 *                No CORS issue because browser sees same origin.
 *
 *   Production → VITE_API_BASE_URL = "https://your-api.onrender.com"
 *                All requests go directly to deployed backend.
 *                server/.env must have CLIENT_URL = deployed frontend URL.
 *
 * VITE_ prefix rule:
 *   Vite only exposes variables starting with VITE_ into the browser bundle.
 *   NEVER put MONGO_URI / JWT_SECRET / CRYPTR_SECRET in client .env.
 *
 * AUTH FLOW:
 *   Request interceptor reads token from localStorage on every call.
 *   → Adds  Authorization: Bearer <token>  header automatically.
 *   → You never need to manually attach headers anywhere else.
 *
 *   Response interceptor catches 401 globally.
 *   → Clears localStorage + redirects to /login when token is invalid/expired.
 */

import axios from "axios";

const client = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || "",
  headers: { "Content-Type": "application/json" },
  withCredentials: true, // forwards cookies if server uses cookie-based auth
});

// ── Request Interceptor ────────────────────────────────────────────────────
// Attaches JWT Bearer token to every outgoing request automatically.
// Reads fresh from localStorage — handles tab-restore and multi-tab scenarios.
client.interceptors.request.use(
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
// Handles expired / invalid tokens globally — no per-component handling needed.
client.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      delete client.defaults.headers.common["Authorization"];

      // Redirect to login only if not already there
      if (window.location.pathname !== "/login") {
        window.location.href = "/login";
      }
    }
    return Promise.reject(error);
  }
);

export { client };
export default client;
