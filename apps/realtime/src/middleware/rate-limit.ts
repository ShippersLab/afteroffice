import type { Context } from "hono";
import { createMiddleware } from "hono/factory";
import type { AppEnv, LimiterName } from "../configuration/env";
import { clientIp, errorResponse } from "../utilities/http";

type KeyOf = (c: Context<AppEnv>) => string;

export function rateLimit(limiter: LimiterName, keyOf: KeyOf) {
  return createMiddleware<AppEnv>(async (c, next) => {
    const outcome = await c.env[limiter].limit({ key: keyOf(c) });
    if (!outcome.success) {
      return errorResponse(c, 429, "rate_limited");
    }
    await next();
  });
}

export const byIp =
  (prefix: string): KeyOf =>
  (c) =>
    `${prefix}:${clientIp(c)}`;

export const byTokenHash: KeyOf = (c) => c.var.tokenHash;
