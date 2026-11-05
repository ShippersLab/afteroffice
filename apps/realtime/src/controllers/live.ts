import type { Context } from "hono";
import { DIRECTORY_NAME } from "../configuration/constants";
import type { AppEnv } from "../configuration/env";
import { errorResponse } from "../utilities/http";
import type { LiveQuery } from "../validators/live";

export async function connectLive(c: Context<AppEnv>, query: LiveQuery): Promise<Response> {
  if (c.req.header("upgrade")?.toLowerCase() !== "websocket") {
    return errorResponse(c, 426, "upgrade_required");
  }
  const directory = c.env.DIRECTORY.getByName(DIRECTORY_NAME);
  if (query.roomId !== undefined && !(await directory.hasFloor(query.roomId))) {
    return errorResponse(c, 404, "unknown_room");
  }
  const roomId = query.roomId ?? (await directory.busiest());
  const url = new URL(c.req.url);
  url.searchParams.set("roomId", roomId);
  return c.env.FLOOR.getByName(roomId).fetch(new Request(url, c.req.raw));
}
