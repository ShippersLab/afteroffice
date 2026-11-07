import type { Context } from "hono";
import type { AppEnv } from "../configuration/env";
import { renameAccount } from "../services/accounts";
import { errorResponse } from "../utilities/http";
import type { NameRequest } from "../validators/name";

export async function renameHandle(c: Context<AppEnv>, body: NameRequest): Promise<Response> {
  if (body.handle === c.var.handle) {
    return c.json({ handle: body.handle });
  }
  const renamed = await renameAccount(c.var.getDatabase, c.var.tokenHash, body.handle);
  return renamed ? c.json({ handle: body.handle }) : errorResponse(c, 409, "handle_taken");
}
