/**
 * VITE CONFIG - vite.config.js
 *
 * INTERVIEW EXPLANATION:
 * The proxy setting is key for local development.
 * When the React app makes a request to /api/..., Vite's dev server
 * forwards it to our Express server at localhost:5000.
 * This avoids CORS issues during development since the browser sees
 * all requests going to the same origin (localhost:5173).
 */

import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    proxy: {
      // Requests to /api/* are forwarded to the Express server
      "/api": {
        target: "http://localhost:5000",
        changeOrigin: true,
      },
    },
  },
});
