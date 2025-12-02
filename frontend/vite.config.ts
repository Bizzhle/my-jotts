import react from "@vitejs/plugin-react";
import { config } from "dotenv";
import { defineConfig } from "vite";

config({ path: `./.env.${process.env.NODE_ENV}` });
config();
// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  const baseConfig = {
    plugins: [react()],
    publicDir: "public",
    build: {
      outDir: "build",
    },
    define: {
      "process.env": "{}",
    },
    test: {
      environment: "jsdom",
      globals: true,
      setupFiles: "./src/setupTests.ts",
      coverage: {
        reporter: ["text", "json", "html"],
        exclude: [
          // "src/app/webapp/utils/contexts/**",
          // "src/app/webapp/utils/hooks/**",
          // "src/app/webapp/utils/libs/**",
          "**/__tests__/**",
          "node_modules/**",
          "**/*.test.ts",
          "**/*.test.tsx",
        ],
      },
    },
  };

  if (mode === "development") {
    return {
      ...baseConfig,
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
    };
  }

  return baseConfig;
});
