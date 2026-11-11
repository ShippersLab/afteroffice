import { HandleSchema } from "@afteroffice/core";
import { renameHandle } from "../client/http-client";
import { readIdentity } from "../storage/identity-store";
import { webUrl } from "../storage/paths";
import { failureText } from "../utilities/failure-text";

const INVALID_HANDLE_MESSAGE =
  "Pick a name with 3 to 32 characters: lowercase letters, digits and hyphens.\n";

export async function runName(args: readonly string[]): Promise<number> {
  const identity = await readIdentity();
  if (identity === undefined) {
    process.stdout.write("Not joined yet. Run: afteroffice join\n");
    return 1;
  }
  const [handle] = args;
  if (handle === undefined) {
    process.stdout.write("Usage: afteroffice name <handle>\n");
    return 1;
  }
  if (!HandleSchema.safeParse(handle).success) {
    process.stdout.write(INVALID_HANDLE_MESSAGE);
    return 1;
  }
  const result = await renameHandle(identity, handle);
  if (!result.ok) {
    if (result.reason === "handle-taken") {
      process.stderr.write("That name is taken. Try another one.\n");
      return 1;
    }
    process.stderr.write(`${failureText(result.reason)}\n`);
    return 1;
  }
  const renamed = result.identity.handle;
  process.stdout.write(`Renamed to ${renamed}\n${webUrl()}/@${renamed}\n`);
  return 0;
}
