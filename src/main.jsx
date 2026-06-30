/**
 * ENTRY POINT - src/main.jsx
 *
 * Wraps the entire app in:
 * - AuthProvider: Makes auth state available everywhere via Context API
 * - BrowserRouter: Enables React Router's client-side routing
 */

import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App";
import { AuthProvider } from "./context/AuthContext";
import "./index.css";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <App />
      </AuthProvider>
    </BrowserRouter>
  </React.StrictMode>
);
