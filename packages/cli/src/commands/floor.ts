import { listSessionIds, readSession } from "../session/session-store";
import { readIdentity } from "../storage/identity-store";
import { webUrl } from "../storage/paths";

const NO_SESSIONS_MESSAGE =
  "Your agent is not on the floor yet. It shows up when it starts working.\n";

export async function runFloor(): Promise<number> {
  const identity = await readIdentity();
  if (identity === undefined) {
    process.stdout.write("Not joined yet. Run: afteroffice join\n");
    return 1;
  }
  const ids = await listSessionIds();
  const sessions = await Promise.all(ids.map((id) => readSession(id)));
  const counts = new Map<string, number>();
  for (const session of sessions) {
    if (session === undefined) {
      continue;
    }
    counts.set(session.roomId, (counts.get(session.roomId) ?? 0) + 1);
  }
  if (counts.size === 0) {
    process.stdout.write(NO_SESSIONS_MESSAGE);
    return 0;
  }
  const lines = [...counts.entries()].map(
    ([floor, count]) => `You are on ${floor} (${count} session${count === 1 ? "" : "s"})\n`,
  );
  process.stdout.write(`${lines.join("")}Watch the club: ${webUrl()}\n`);
  return 0;
}
