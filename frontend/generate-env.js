// generate-env.js
import dotenv from "dotenv";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

// Define __dirname for ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load from .env
const env = dotenv.config({ path: path.resolve(__dirname, ".env") }).parsed;

// Whitelist only safe keys for frontend
const allowedKeys = [
  "VITE_API_URL",
  "VITE_STRIPE_PUBLISHABLE_KEY",
  "VITE_ANALYTICS_ID",
];

const publicEnv = {};
for (const key of allowedKeys) {
  if (env[key]) publicEnv[key] = env[key];
}

// Write to public/env.js

const envString = `window.env = ${JSON.stringify(publicEnv, null, 2)};`;
fs.writeFileSync(path.resolve(__dirname, "frontend/public/env.js"), envString);

console.log("✅ public/env.js generated");
