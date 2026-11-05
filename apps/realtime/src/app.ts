import { Hono } from "hono";
import type { AppEnv } from "./configuration/env";
import { database } from "./middleware/database";
import { onError, onNotFound } from "./middleware/error-handler";
import { noStore, securityHeaders } from "./middleware/security";
import { healthRoutes } from "./routes/health";
import { v1Routes } from "./routes/index";

export const app = new Hono<AppEnv>()
  .use(securityHeaders, noStore, database)
  .route("/", healthRoutes)
  .route("/v1", v1Routes)
  .onError(onError)
  .notFound(onNotFound);
