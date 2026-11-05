import { createHash } from "node:crypto";
import { type SessionId, SessionIdSchema } from "@afteroffice/core";

const SESSION_ID_LENGTH = 32;

export function deriveSessionId(harnessSessionId: string): SessionId {
  const hashed = createHash("sha256").update(harnessSessionId).digest("base64url");
  return SessionIdSchema.parse(hashed.slice(0, SESSION_ID_LENGTH));
}
