import type { Context } from "hono";
import { DIRECTORY_NAME } from "../configuration/constants";
import type { AppEnv } from "../configuration/env";

export async function readStats(c: Context<AppEnv>): Promise<Response> {
  return c.json(await c.env.DIRECTORY.getByName(DIRECTORY_NAME).stats());
}
