import { type Tile, tileKey } from "../mathematics/iso";

export const GRID_SIZE = 14;
export const DOOR_TILE: Tile = { x: 0, y: 12 };
export const VIP_GAP_ROW = 12;

export type Rect = {
  readonly x: number;
  readonly y: number;
  readonly w: number;
  readonly h: number;
};

export function rectTiles(rect: Rect): Tile[] {
  const tiles: Tile[] = [];
  for (let y = rect.y; y < rect.y + rect.h; y += 1) {
    for (let x = rect.x; x < rect.x + rect.w; x += 1) {
      tiles.push({ x, y });
    }
  }
  return tiles;
}

export const DANCE_RECT: Rect = { x: 4, y: 4, w: 6, h: 6 };
export const VIP_RECT: Rect = { x: 10, y: 10, w: 4, h: 4 };

export const BLOCKED_RECTS: readonly Rect[] = [
  { x: 1, y: 1, w: 5, h: 1 },
  { x: 8, y: 0, w: 5, h: 2 },
  { x: 13, y: 10, w: 1, h: 2 },
  { x: 10, y: 13, w: 2, h: 1 },
];

const BLOCKED_KEYS: ReadonlySet<string> = new Set(
  BLOCKED_RECTS.flatMap((rect) => rectTiles(rect)).map(tileKey),
);

export function inBounds(tile: Tile): boolean {
  return tile.x >= 0 && tile.y >= 0 && tile.x < GRID_SIZE && tile.y < GRID_SIZE;
}

export function isWalkable(tile: Tile): boolean {
  return inBounds(tile) && !BLOCKED_KEYS.has(tileKey(tile));
}

export function isVipTile(tile: Tile): boolean {
  return (
    tile.x >= VIP_RECT.x &&
    tile.y >= VIP_RECT.y &&
    tile.x < VIP_RECT.x + VIP_RECT.w &&
    tile.y < VIP_RECT.y + VIP_RECT.h
  );
}

export function isDanceTile(tile: Tile): boolean {
  return (
    tile.x >= DANCE_RECT.x &&
    tile.y >= DANCE_RECT.y &&
    tile.x < DANCE_RECT.x + DANCE_RECT.w &&
    tile.y < DANCE_RECT.y + DANCE_RECT.h
  );
}

export const ZONE_RECTS = {
  dance: [DANCE_RECT],
  dj: [{ x: 2, y: 0, w: 3, h: 1 }],
  bar: [{ x: 8, y: 2, w: 5, h: 1 }],
  sofa: [
    { x: 0, y: 2, w: 1, h: 3 },
    { x: 0, y: 6, w: 1, h: 3 },
  ],
  door: [{ x: 1, y: 10, w: 2, h: 4 }],
  spill: [{ x: 7, y: 3, w: 6, h: 1 }],
  vip: [VIP_RECT],
} as const satisfies Record<string, readonly Rect[]>;
