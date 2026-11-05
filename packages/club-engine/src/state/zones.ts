import type { AgentState } from "@afteroffice/core";
import { type Tile, tileKey } from "../mathematics/iso";
import type { Rng } from "../mathematics/rng";
import { isWalkable, type Rect, rectTiles, ZONE_RECTS } from "./layout";

export type ZoneId = keyof typeof ZONE_RECTS;

export const WANDER_MIN_TILES = 6;

function tilesOfZone(zone: ZoneId): Tile[] {
  const rects: readonly Rect[] = ZONE_RECTS[zone];
  return rects.flatMap((rect) => rectTiles(rect)).filter(isWalkable);
}

export const ZONE_TILES: Readonly<Record<ZoneId, readonly Tile[]>> = {
  dance: tilesOfZone("dance"),
  dj: tilesOfZone("dj"),
  bar: tilesOfZone("bar"),
  sofa: tilesOfZone("sofa"),
  door: tilesOfZone("door"),
  spill: tilesOfZone("spill"),
  vip: tilesOfZone("vip"),
};

export function zoneForState(state: AgentState, vip: boolean): ZoneId {
  if (vip) {
    return "vip";
  }
  switch (state) {
    case "dancing":
      return "dance";
    case "dj-booth":
      return "dj";
    case "at-the-bar":
      return "bar";
    case "asleep-on-the-sofa":
      return "sofa";
    case "stuck-at-the-door":
      return "door";
    case "spilled-drink":
      return "spill";
    default: {
      const unhandled: never = state;
      throw new Error(`Unhandled agent state: ${String(unhandled)}`);
    }
  }
}

function freeIn(tiles: readonly Tile[], taken: ReadonlySet<string>): Tile[] {
  return tiles.filter((tile) => !taken.has(tileKey(tile)));
}

export function pickTile(zone: ZoneId, taken: ReadonlySet<string>, rng: Rng): Tile {
  const own = ZONE_TILES[zone];
  const free = freeIn(own, taken);
  const fallback = zone === "vip" ? [] : freeIn(ZONE_TILES.dance, taken);
  const pool = free.length > 0 ? free : fallback.length > 0 ? fallback : own;
  return rng.pick(pool) ?? { x: 0, y: 12 };
}

export function canWander(zone: ZoneId): boolean {
  return ZONE_TILES[zone].length >= WANDER_MIN_TILES;
}
