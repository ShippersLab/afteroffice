import type { Context } from "hono";
import type { AppEnv } from "../configuration/env";
import { createAccount } from "../services/accounts";
import { generateToken, hashToken } from "../services/tokens";
import { errorResponse } from "../utilities/http";

export async function join(c: Context<AppEnv>): Promise<Response> {
  const token = generateToken();
  const handle = await createAccount(c.var.getDatabase, await hashToken(token));
  if (handle === null) {
    return errorResponse(c, 503, "handle_unavailable");
  }
  return c.json({ handle, token }, 201);
}
