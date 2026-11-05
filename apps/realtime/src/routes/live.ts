import { zValidator } from "@hono/zod-validator";
import { Hono } from "hono";
import type { AppEnv } from "../configuration/env";
import { connectLive } from "../controllers/live";
import { byIp, rateLimit } from "../middleware/rate-limit";
import { publicCors } from "../middleware/security";
import { errorResponse } from "../utilities/http";
import { LiveQuerySchema } from "../validators/live";

export const liveRoutes = new Hono<AppEnv>().use("/live", publicCors).get(
  "/live",
  rateLimit("LIVE_LIMITER", byIp("live")),
  zValidator("query", LiveQuerySchema, (result, c) =>
    result.success ? undefined : errorResponse(c, 400, "invalid_room"),
  ),
  (c) => connectLive(c, c.req.valid("query")),
);
