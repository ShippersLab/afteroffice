import { Hono } from "hono";
import type { AppEnv } from "../configuration/env";
import { join } from "../controllers/join";
import { byIp, rateLimit } from "../middleware/rate-limit";

export const joinRoutes = new Hono<AppEnv>().post(
  "/join",
  rateLimit("JOIN_LIMITER", byIp("join")),
  join,
);
