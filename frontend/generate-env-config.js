import fs from "fs";
import path from "path";
import process from "process";

/**
kept for research purposes
 * 
 * Parses a .env file into an object
 * @param {string} envPath
 * @returns {Record<string, string>}
 */
function parseEnv(envPath) {
  if (!fs.existsSync(envPath)) return {};

  const env = {};
  const content = fs.readFileSync(envPath, "utf8");

  content.split("\n").forEach((line) => {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) return;

    const matches = trimmed.match(/^([^=:#]+?)[=:](.*)$/);
    if (matches) {
      const key = matches[1].trim();
      let value = matches[2].trim();

      // Remove quotes
      if (
        (value.startsWith('"') && value.endsWith('"')) ||
        (value.startsWith("'") && value.endsWith("'"))
      ) {
        value = value.slice(1, -1);
      }

      env[key] = value;
    }
  });

  return env;
}

/**
 * Merges default, mode-specific, local, and runtime envs
 * Priority: .env → .env.{mode} → .env.local → process.env
 * @param {string} mode
 * @returns {Record<string, string>}
 */
function loadMergedEnv(mode) {
  const baseDir = process.cwd();

  return {
    ...parseEnv(path.join(baseDir, ".env")),
    ...parseEnv(path.join(baseDir, `.env.${mode}`)),
    ...parseEnv(path.join(baseDir, ".env.local")),
    ...process.env,
  };
}

/**
 * Replaces template variables with environment values
 * @param {string} template
 * @param {Record<string, string>} env
 * @returns {string}
 */
function renderTemplate(template, env) {
  return template.replace(/\$\{([^}]+)\}/g, (_, key) => env[key] ?? "");
}

/**
 * Writes the rendered config to public/config.js
 * @param {string} content
 */
function writeRuntimeConfig(content) {
  const publicDir = path.resolve(process.cwd(), "public");

  if (!fs.existsSync(publicDir)) {
    fs.mkdirSync(publicDir, { recursive: true });
  }

  fs.writeFileSync(path.join(publicDir, "config.js"), content, "utf8");
  console.log("✅ Runtime environment config generated at public/config.js");
}

/**
 * Main entry point
 */
function createRuntimeConfig() {
  try {
    const mode = process.env.NODE_ENV || "development";
    console.log(`🔧 Generating runtime config for mode: ${mode}`);

    const env = loadMergedEnv(mode);

    const templatePath = path.resolve(process.cwd(), "config-template.js");
    const template = fs.readFileSync(templatePath, "utf8");

    const configContent = renderTemplate(template, env);
    writeRuntimeConfig(configContent);
  } catch (err) {
    console.error("❌ Failed to generate runtime config:", err);
    process.exit(1);
  }
}

createRuntimeConfig();
