import React, { createContext, useState, useContext, useEffect } from "react";
import { client } from "../api/client";

const AuthContext = createContext(null);

/**
 * AuthProvider — wraps the app so every component can access auth state
 * via the useAuth() hook without prop drilling.
 *
 * AUTH DATA FLOW:
 *   register / login
 *     → POST /api/auth/register | /api/auth/login
 *     → server returns { _id, name, email, role, token }
 *     → token saved to localStorage
 *     → client.defaults header set for immediate subsequent calls
 *     → React user state updated → triggers re-renders across app
 *
 *   On page refresh (useEffect on mount):
 *     → Read token + user from localStorage
 *     → Restore React state + set axios header
 *     → loading = false → ProtectedRoute renders correctly
 *
 *   logout:
 *     → Remove token + user from localStorage
 *     → Delete axios header
 *     → setUser(null) → ProtectedRoute redirects to /login
 */
export const AuthProvider = ({ children }) => {
  const [user, setUser]     = useState(null);
  const [loading, setLoading] = useState(true);

  // ── Restore session from localStorage on mount ──────────────────────────
  useEffect(() => {
    const token     = localStorage.getItem("token");
    const savedUser = localStorage.getItem("user");

    if (token && savedUser) {
      setUser(JSON.parse(savedUser));
      // Set header on the shared client instance immediately
      client.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    }

    setLoading(false); // Allow ProtectedRoute to proceed
  }, []);

  // ── Login ────────────────────────────────────────────────────────────────
  // Flow: POST /api/auth/login → { token, ...userData }
  const login = async (email, password) => {
    const { data } = await client.post("/api/auth/login", { email, password });
    const { token, ...userData } = data;

    localStorage.setItem("token", token);
    localStorage.setItem("user", JSON.stringify(userData));
    client.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    setUser(userData);

    return userData;
  };

  // ── Register ─────────────────────────────────────────────────────────────
  // Flow: POST /api/auth/register → { token, ...userData }
  const register = async (name, email, password) => {
    const { data } = await client.post("/api/auth/register", { name, email, password });
    const { token, ...userData } = data;

    localStorage.setItem("token", token);
    localStorage.setItem("user", JSON.stringify(userData));
    client.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    setUser(userData);

    return userData;
  };

  // ── Logout ───────────────────────────────────────────────────────────────
  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    delete client.defaults.headers.common["Authorization"];
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook — clean consumption of auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within an AuthProvider");
  return context;
};

export default AuthContext;
