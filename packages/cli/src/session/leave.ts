import { sendEventAs } from "../client/http-client";
import type { Identity } from "../storage/identity-store";
import { listSessionIds, readSession, removeSession } from "./session-store";

export async function leaveAllSessions(identity: Identity): Promise<number> {
  const ids = await listSessionIds();
  await Promise.all(
    ids.map(async (sessionId) => {
      const session = await readSession(sessionId);
      if (session !== undefined) {
        await sendEventAs(identity, { type: "leave", sessionId, roomId: session.roomId });
      }
      await removeSession(sessionId);
    }),
  );
  return ids.length;
}
