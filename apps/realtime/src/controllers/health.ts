import type { Context } from "hono";
import type { AppEnv } from "../configuration/env";

export function health(c: Context<AppEnv>): Response {
  return c.json({ ok: true });
}
