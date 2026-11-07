import { join } from "../client/http-client";
import { readIdentity } from "../storage/identity-store";
import { webUrl } from "../storage/paths";
import { failureText } from "../utilities/failure-text";

function profileLink(handle: string): string {
  return `${webUrl()}/@${handle}`;
}

export async function runJoin(): Promise<number> {
  const existing = await readIdentity();
  if (existing !== undefined) {
    process.stdout.write(`Already joined as ${existing.handle}\n${profileLink(existing.handle)}\n`);
    return 0;
  }
  const result = await join();
  if (!result.ok) {
    process.stderr.write(`${failureText(result.reason)}\n`);
    return 1;
  }
  const { handle } = result.identity;
  process.stdout.write(`Joined the club as ${handle}\n${profileLink(handle)}\n`);
  return 0;
}
