import { ClubEventSchema, MAX_EVENT_BYTES } from "@afteroffice/core";
import { zValidator } from "@hono/zod-validator";
import { Hono } from "hono";
import { bodyLimit } from "hono/body-limit";
import type { AppEnv } from "../configuration/env";
import { receiveEvent } from "../controllers/events";
import { bearerToken, resolveAccount } from "../middleware/auth";
import { byTokenHash, rateLimit } from "../middleware/rate-limit";
import { errorResponse } from "../utilities/http";

export const eventsRoutes = new Hono<AppEnv>().post(
  "/events",
  bearerToken,
  rateLimit("EVENTS_LIMITER", byTokenHash),
  resolveAccount,
  bodyLimit({
    maxSize: MAX_EVENT_BYTES,
    onError: (c) => errorResponse(c, 413, "too_large"),
  }),
  zValidator("json", ClubEventSchema, (result, c) =>
    result.success ? undefined : errorResponse(c, 400, "invalid_event"),
  ),
  (c) => receiveEvent(c, c.req.valid("json")),
);
