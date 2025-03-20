import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    host: "0.0.0.0", // ✅ Allow connections from Docker
    port: 5173,
    strictPort: true,
    watch: {
      usePolling: true, // ✅ Ensure file changes are detected inside Docker
      interval: 500,
    },
    hmr: {
      protocol: "ws",
      host: "localhost", // ✅ WebSocket should connect to localhost
      clientPort: 5173, // ✅ Ensures HMR works correctly
    },
    origin: "http://frontend:5173", // ✅ Allow all origins
  },
});
