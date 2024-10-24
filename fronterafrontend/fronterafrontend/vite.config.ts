import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  server: {
    proxy: {
      "/api": "https://api.fronterascheduling.com",
      // "/api": "http://13.61.2.154:3000/",
      // "/api": "http:/localhost:3000/",

    },
  },
});
