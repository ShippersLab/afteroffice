import { Hono } from "hono";
import type { AppEnv } from "../configuration/env";
import { health } from "../controllers/health";

export const healthRoutes = new Hono<AppEnv>().get("/health", health);
