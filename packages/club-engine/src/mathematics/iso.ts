export const TILE_W = 80;
export const TILE_H = 40;

export type Tile = { readonly x: number; readonly y: number };
export type Point = { readonly x: number; readonly y: number };

export function tileToScreen(x: number, y: number): Point {
  return { x: ((x - y) * TILE_W) / 2, y: ((x + y) * TILE_H) / 2 };
}

export function tileCenter(x: number, y: number): Point {
  return tileToScreen(x + 0.5, y + 0.5);
}

export function screenToTile(sx: number, sy: number): Point {
  const a = sx / (TILE_W / 2);
  const b = sy / (TILE_H / 2);
  return { x: (a + b) / 2, y: (b - a) / 2 };
}

export function tileKey(tile: Tile): string {
  return `${tile.x},${tile.y}`;
}

export function sameTile(a: Tile, b: Tile): boolean {
  return a.x === b.x && a.y === b.y;
}

export function feetDepth(x: number, y: number): number {
  return ((x + y + 1) * TILE_H) / 2;
}
