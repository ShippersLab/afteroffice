import { cors } from "hono/cors";
import { createMiddleware } from "hono/factory";
import { secureHeaders } from "hono/secure-headers";
import type { AppEnv } from "../configuration/env";

export const securityHeaders = secureHeaders({ referrerPolicy: "no-referrer" });

export const noStore = createMiddleware<AppEnv>(async (c, next) => {
  await next();
  c.res.headers.set("cache-control", "no-store");
});

export const publicCors = cors({ origin: "*", allowMethods: ["GET", "OPTIONS"] });
