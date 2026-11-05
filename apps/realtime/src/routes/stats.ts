import { Hono } from "hono";
import type { AppEnv } from "../configuration/env";
import { readStats } from "../controllers/stats";
import { publicCors } from "../middleware/security";

export const statsRoutes = new Hono<AppEnv>().use("/stats", publicCors).get("/stats", readStats);
