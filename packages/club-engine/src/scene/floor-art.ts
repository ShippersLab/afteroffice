import { TILE_H, TILE_W } from "../mathematics/iso";
import { COLOR } from "../sprites/palette";
import { Pixels } from "../sprites/pixels";
import { GRID_SIZE } from "../state/layout";

export const WALL_H = 170;
export const WALL_SPAN = (GRID_SIZE * TILE_W) / 2;

function insideDiamond(x: number, y: number, inset: number): boolean {
  const dx = Math.abs(x + 0.5 - TILE_W / 2) / (TILE_W / 2);
  const dy = Math.abs(y + 0.5 - TILE_H / 2) / (TILE_H / 2);
  return dx + dy <= 1 - inset / (TILE_H / 2);
}

export function floorTile(fill: number, edge: number): Pixels {
  const pixels = new Pixels(TILE_W, TILE_H);
  for (let y = 0; y < TILE_H; y += 1) {
    for (let x = 0; x < TILE_W; x += 1) {
      if (insideDiamond(x, y, 0)) {
        pixels.set(x, y, insideDiamond(x, y, 1) ? fill : edge);
      }
    }
  }
  return pixels;
}

export function glowTile(color: number): Pixels {
  const pixels = new Pixels(TILE_W, TILE_H);
  for (let y = 0; y < TILE_H; y += 1) {
    for (let x = 0; x < TILE_W; x += 1) {
      if (insideDiamond(x, y, 4)) {
        pixels.set(x, y, color);
      }
    }
  }
  return pixels;
}

export function discPixels(width: number, height: number, color: number): Pixels {
  const pixels = new Pixels(width, height);
  for (let y = 0; y < height; y += 1) {
    for (let x = 0; x < width; x += 1) {
      const dx = (x + 0.5 - width / 2) / (width / 2);
      const dy = (y + 0.5 - height / 2) / (height / 2);
      if (dx * dx + dy * dy <= 1) {
        pixels.set(x, y, color);
      }
    }
  }
  return pixels;
}

export function wallStrip(side: "right" | "left"): Pixels {
  const base: number = side === "right" ? COLOR.panel : COLOR.velvet;
  const pixels = new Pixels(WALL_SPAN, WALL_SPAN / 2 + WALL_H);
  for (let px = 0; px < WALL_SPAN; px += 1) {
    const slope = side === "right" ? px : WALL_SPAN - 1 - px;
    const top = Math.floor(slope / 2);
    for (let i = 0; i < WALL_H; i += 1) {
      const fromBottom = WALL_H - 1 - i;
      let color = base;
      if (i < 4) {
        color = COLOR.haze;
      } else if (fromBottom < 4) {
        color = COLOR.line;
      } else if (fromBottom < 40) {
        color = px % 40 === 0 ? COLOR.panel : mixPanel(base);
      } else if (px % 40 === 0) {
        color = COLOR.line;
      }
      pixels.set(px, top + i, color);
    }
  }
  return pixels;
}

function mixPanel(base: number): number {
  return base === COLOR.panel ? COLOR.velvet : 0x221a3d;
}
