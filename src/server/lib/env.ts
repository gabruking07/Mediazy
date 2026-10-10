import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";

const SERVER_ENV_PATH = join(process.cwd(), "src", "server", ".env");

export function loadServerEnv() {
  if (process.env.MEDIAZY_SERVER_ENV_LOADED === "true") return;

  if (existsSync(SERVER_ENV_PATH)) {
    const entries = parseEnvFile(readFileSync(SERVER_ENV_PATH, "utf8"));
    for (const [key, value] of Object.entries(entries)) {
      if (!process.env[key]) {
        process.env[key] = value;
      }
    }
  }

  if (process.env.DATABASE_URL) {
    process.env.DATABASE_URL = normalizeMongoDatabaseUrl(process.env.DATABASE_URL, "mediazy");
  }

  process.env.MEDIAZY_SERVER_ENV_LOADED = "true";
}

export function requireServerEnv(key: string) {
  loadServerEnv();
  const value = process.env[key];
  if (!value) {
    throw new Error(`Missing required server environment variable: ${key}`);
  }
  return value;
}

function parseEnvFile(source: string) {
  const values: Record<string, string> = {};

  for (const line of source.split(/\r?\n/)) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;

    const separatorIndex = trimmed.indexOf("=");
    if (separatorIndex === -1) continue;

    const key = trimmed.slice(0, separatorIndex).trim();
    const rawValue = trimmed.slice(separatorIndex + 1).trim();
    values[key] = rawValue.replace(/^["']|["']$/g, "");
  }

  return values;
}

function normalizeMongoDatabaseUrl(value: string, databaseName: string) {
  if (!value.startsWith("mongodb://") && !value.startsWith("mongodb+srv://")) {
    return value;
  }

  try {
    const url = new URL(value);
    if (!url.pathname || url.pathname === "/") {
      url.pathname = `/${databaseName}`;
    }
    return url.toString();
  } catch {
    return value;
  }
}
