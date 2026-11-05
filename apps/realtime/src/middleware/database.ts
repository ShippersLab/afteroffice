import { createMiddleware } from "hono/factory";
import type { AppEnv } from "../configuration/env";
import { createRequestDatabase } from "../database/request-database";

export const database = createMiddleware<AppEnv>(async (c, next) => {
  const requestDatabase = createRequestDatabase(c.env);
  c.set("getDatabase", requestDatabase.get);
  try {
    await next();
  } finally {
    c.executionCtx.waitUntil(requestDatabase.close());
  }
});
