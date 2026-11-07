import { readIdentity } from "../storage/identity-store";
import { floorSummary } from "../utilities/floor-summary";

export async function runFloor(): Promise<number> {
  const identity = await readIdentity();
  if (identity === undefined) {
    process.stdout.write("Not joined yet. Run: afteroffice join\n");
    return 1;
  }
  process.stdout.write(`${await floorSummary()}\n`);
  return 0;
}
