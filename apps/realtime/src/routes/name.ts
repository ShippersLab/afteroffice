import { MAX_EVENT_BYTES } from "@afteroffice/core";
import { zValidator } from "@hono/zod-validator";
import { Hono } from "hono";
import { bodyLimit } from "hono/body-limit";
import type { AppEnv } from "../configuration/env";
import { renameHandle } from "../controllers/name";
import { bearerToken, resolveAccount } from "../middleware/auth";
import { byTokenHash, rateLimit } from "../middleware/rate-limit";
import { errorResponse } from "../utilities/http";
import { NameRequestSchema } from "../validators/name";

export const nameRoutes = new Hono<AppEnv>().post(
  "/name",
  bearerToken,
  rateLimit("EVENTS_LIMITER", byTokenHash),
  resolveAccount,
  bodyLimit({
    maxSize: MAX_EVENT_BYTES,
    onError: (c) => errorResponse(c, 413, "too_large"),
  }),
  zValidator("json", NameRequestSchema, (result, c) =>
    result.success ? undefined : errorResponse(c, 400, "invalid_handle"),
  ),
  (c) => renameHandle(c, c.req.valid("json")),
);
