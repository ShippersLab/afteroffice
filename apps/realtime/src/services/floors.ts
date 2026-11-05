import { MIN_ALARM_DELAY_MS } from "../configuration/constants";
import { type Rand, randomInt, secureRandom } from "../utilities/random";

export type FloorCount = { floor: number; count: number };

export function pickFloor(
  floors: readonly FloorCount[],
  capacity: number,
  rand: Rand = secureRandom,
): number {
  const open = floors.filter((entry) => entry.count < capacity);
  const chosen = open[randomInt(open.length, rand)];
  if (chosen !== undefined) {
    return chosen.floor;
  }
  return floors.reduce((highest, entry) => Math.max(highest, entry.floor), 0) + 1;
}

export function busiestFloor(floors: readonly FloorCount[]): number {
  let best: FloorCount | undefined;
  for (const entry of floors) {
    if (
      best === undefined ||
      entry.count > best.count ||
      (entry.count === best.count && entry.floor < best.floor)
    ) {
      best = entry;
    }
  }
  return best !== undefined && best.count > 0 ? best.floor : 1;
}

export function nextAlarmAt(oldestSeen: number, now: number, timeoutMs: number): number {
  return Math.max(oldestSeen + timeoutMs, now + MIN_ALARM_DELAY_MS);
}
