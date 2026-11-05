import { leaveAllSessions } from "../session/leave";
import { readIdentity } from "../storage/identity-store";

export async function runLeaveAll(): Promise<number> {
  const identity = await readIdentity();
  if (identity === undefined) {
    process.stdout.write("Not joined yet. Run: afteroffice join\n");
    return 1;
  }
  const count = await leaveAllSessions(identity);
  process.stdout.write(`Left the club with ${count} session${count === 1 ? "" : "s"}\n`);
  return 0;
}
