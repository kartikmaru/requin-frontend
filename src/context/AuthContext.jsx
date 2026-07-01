import React, { createContext, useState, useContext, useEffect } from "react";
import { client } from "../api/client";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user,    setUser]    = useState(null);
  const [loading, setLoading] = useState(true);

  // ── Restore session from localStorage on page refresh ──────────────────────
  useEffect(() => {
    const token     = localStorage.getItem("token");
    const savedUser = localStorage.getItem("user");

    if (token && savedUser) {
      setUser(JSON.parse(savedUser));
      client.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    }

    setLoading(false);
  }, []);

  // ── Login ─────────────────────────────────────────────────────────────────
  // Server sets httpOnly cookie AND returns token in JSON body.
  // We save token to localStorage for the Authorization header fallback.
  const login = async (email, password) => {
    const { data } = await client.post("/api/auth/login", { email, password });
    const { token, ...userData } = data;

    localStorage.setItem("token", token);
    localStorage.setItem("user", JSON.stringify(userData));
    client.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    setUser(userData);

    return userData;
  };

  // ── Register ──────────────────────────────────────────────────────────────
  const register = async (name, email, password) => {
    const { data } = await client.post("/api/auth/register", { name, email, password });
    const { token, ...userData } = data;

    localStorage.setItem("token", token);
    localStorage.setItem("user", JSON.stringify(userData));
    client.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    setUser(userData);

    return userData;
  };

  // ── Logout ────────────────────────────────────────────────────────────────
  // 1. POST /api/auth/logout → server clears the httpOnly cookie
  // 2. Clear localStorage + axios header
  // 3. setUser(null) → ProtectedRoute redirects to /login
  const logout = async () => {
    try {
      await client.post("/api/auth/logout");
    } catch {
      // Silently ignore — even if API fails, clear client state
    } finally {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      delete client.defaults.headers.common["Authorization"];
      setUser(null);
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within an AuthProvider");
  return context;
};

export default AuthContext;
