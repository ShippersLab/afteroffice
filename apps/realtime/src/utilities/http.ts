import type { Context } from "hono";
import type { ContentfulStatusCode } from "hono/utils/http-status";

export function errorResponse(c: Context, status: ContentfulStatusCode, code: string): Response {
  return c.json({ error: code }, status);
}

export function clientIp(c: Context): string {
  return c.req.header("cf-connecting-ip") ?? "unknown";
}
