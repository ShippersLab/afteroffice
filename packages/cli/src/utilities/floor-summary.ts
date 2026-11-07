import { listSessionIds, readSession } from "../session/session-store";
import { webUrl } from "../storage/paths";

export async function floorSummary(): Promise<string> {
  const ids = await listSessionIds();
  const sessions = await Promise.all(ids.map((id) => readSession(id)));
  const counts = new Map<string, number>();
  for (const session of sessions) {
    if (session !== undefined) {
      counts.set(session.roomId, (counts.get(session.roomId) ?? 0) + 1);
    }
  }
  if (counts.size === 0) {
    return "Your agent is not on the floor yet. It shows up when it starts working.";
  }
  const lines = [...counts.entries()].map(
    ([floor, count]) => `You are on ${floor} (${count} session${count === 1 ? "" : "s"})`,
  );
  return `${lines.join("\n")}\nWatch the club: ${webUrl()}`;
}
