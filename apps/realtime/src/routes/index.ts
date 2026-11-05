import { Hono } from "hono";
import type { AppEnv } from "../configuration/env";
import { eventsRoutes } from "./events";
import { joinRoutes } from "./join";
import { liveRoutes } from "./live";
import { statsRoutes } from "./stats";

export const v1Routes = new Hono<AppEnv>()
  .route("/", joinRoutes)
  .route("/", eventsRoutes)
  .route("/", liveRoutes)
  .route("/", statsRoutes);
