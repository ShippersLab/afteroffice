import { homedir } from "node:os";
import { join } from "node:path";
import { z } from "zod";

const DEFAULT_API_URL = "http://localhost:8787";
const DEFAULT_WEB_URL = "https://afteroffice.club";

const UrlSchema = z.url({ protocol: /^https?$/ });

function envUrl(name: string, fallback: string): string {
  const parsed = UrlSchema.safeParse(process.env[name]);
  return (parsed.success ? parsed.data : fallback).replace(/\/+$/, "");
}

export function dataDir(): string {
  return process.env.AFTEROFFICE_HOME ?? join(homedir(), ".afteroffice");
}

export function identityPath(): string {
  return join(dataDir(), "identity.json");
}

export function sessionsDir(): string {
  return join(dataDir(), "sessions");
}

export function apiUrl(): string {
  return envUrl("AFTEROFFICE_URL", DEFAULT_API_URL);
}

export function webUrl(): string {
  return envUrl("AFTEROFFICE_WEB_URL", DEFAULT_WEB_URL);
}
