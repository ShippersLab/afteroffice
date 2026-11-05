import { type Tile, tileKey } from "./iso";

export type PathRules = {
  walkable(tile: Tile): boolean;
  canStep(from: Tile, to: Tile): boolean;
};

const STEPS: readonly Tile[] = [
  { x: 1, y: 0 },
  { x: 0, y: 1 },
  { x: -1, y: 0 },
  { x: 0, y: -1 },
];

export function findPath(from: Tile, to: Tile, rules: PathRules): Tile[] | null {
  if (!rules.walkable(to)) {
    return null;
  }
  if (from.x === to.x && from.y === to.y) {
    return [];
  }
  const cameFrom = new Map<string, Tile>();
  const seen = new Set<string>([tileKey(from)]);
  const queue: Tile[] = [from];
  for (let head = 0; head < queue.length; head += 1) {
    const current = queue[head];
    if (!current) {
      break;
    }
    for (const step of STEPS) {
      const next: Tile = { x: current.x + step.x, y: current.y + step.y };
      const key = tileKey(next);
      if (seen.has(key) || !rules.walkable(next) || !rules.canStep(current, next)) {
        continue;
      }
      seen.add(key);
      cameFrom.set(key, current);
      if (next.x === to.x && next.y === to.y) {
        return rebuild(cameFrom, from, to);
      }
      queue.push(next);
    }
  }
  return null;
}

function rebuild(cameFrom: ReadonlyMap<string, Tile>, from: Tile, to: Tile): Tile[] {
  const path: Tile[] = [];
  let cursor: Tile | undefined = to;
  while (cursor && !(cursor.x === from.x && cursor.y === from.y)) {
    path.push(cursor);
    cursor = cameFrom.get(tileKey(cursor));
  }
  return path.toReversed();
}
