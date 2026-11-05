import { createMiddleware } from "hono/factory";
import type { AppEnv } from "../configuration/env";
import { findHandle } from "../services/accounts";
import { hashToken } from "../services/tokens";
import { errorResponse } from "../utilities/http";
import { BearerHeaderSchema } from "../validators/auth";

export const bearerToken = createMiddleware<AppEnv>(async (c, next) => {
  const parsed = BearerHeaderSchema.safeParse(c.req.header("authorization"));
  if (!parsed.success) {
    return errorResponse(c, 401, "unauthorized");
  }
  c.set("tokenHash", await hashToken(parsed.data));
  await next();
});

export const resolveAccount = createMiddleware<AppEnv>(async (c, next) => {
  const handle = await findHandle(c.var.getDatabase, c.var.tokenHash);
  if (handle === null) {
    return errorResponse(c, 401, "unauthorized");
  }
  c.set("handle", handle);
  await next();
});
