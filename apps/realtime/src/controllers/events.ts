import type { ClubEvent } from "@afteroffice/core";
import type { Context } from "hono";
import { DIRECTORY_NAME } from "../configuration/constants";
import type { AppEnv } from "../configuration/env";
import { errorResponse } from "../utilities/http";

export async function receiveEvent(c: Context<AppEnv>, event: ClubEvent): Promise<Response> {
  const { handle } = c.var;
  if (event.type === "enter") {
    const roomId = await c.env.DIRECTORY.getByName(DIRECTORY_NAME).assign();
    const entered = await c.env.FLOOR.getByName(roomId).enter(
      roomId,
      event.sessionId,
      handle,
      event.agent,
    );
    return entered ? c.json({ roomId, vip: false }) : errorResponse(c, 409, "session_conflict");
  }
  const applied = await c.env.FLOOR.getByName(event.roomId).apply(event, handle);
  return applied ? c.body(null, 204) : errorResponse(c, 409, "unknown_session");
}
