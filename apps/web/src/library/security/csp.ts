import { realtimeOrigins } from "../realtime/realtime-url.ts";

export const buildCsp = (realtimeUrl: string | undefined): string => {
  const connect = ["'self'", ...realtimeOrigins(realtimeUrl)].join(" ");
  return [
    "default-src 'self'",
    `connect-src ${connect}`,
    "img-src 'self' data: blob:",
    "font-src 'self' data:",
    "style-src 'self' 'unsafe-inline'",
    "script-src 'self'",
    "worker-src 'self' blob:",
    "object-src 'none'",
    "base-uri 'none'",
    "form-action 'none'",
  ].join("; ");
};
