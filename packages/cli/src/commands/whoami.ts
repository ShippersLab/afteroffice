import { readIdentity } from "../storage/identity-store";
import { webUrl } from "../storage/paths";

export async function runWhoami(): Promise<number> {
  const identity = await readIdentity();
  if (identity === undefined) {
    process.stdout.write("Not joined yet. Run: afteroffice join\n");
    return 1;
  }
  process.stdout.write(`${identity.handle}\n${webUrl()}\n`);
  return 0;
}
