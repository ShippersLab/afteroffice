import { TILE_H, TILE_W } from "../mathematics/iso";
import { Pixels } from "../sprites/pixels";

export type BoxColors = {
  readonly top: number;
  readonly left: number;
  readonly right: number;
  readonly line: number;
};

type Face = 0 | 1 | 2 | 3;

export function boxSize(w: number, d: number, h: number): { width: number; height: number } {
  return {
    width: Math.round(((w + d) * TILE_W) / 2),
    height: Math.round(((w + d) * TILE_H) / 2 + h),
  };
}

function faceAt(px: number, py: number, w: number, d: number, h: number): Face {
  const hw = TILE_W / 2;
  const hh = TILE_H / 2;
  const cx = px + 0.5;
  const cy = py + 0.5;
  const u = (cy / hh + (cx - d * hw) / hw) / 2;
  const v = (cy / hh - (cx - d * hw) / hw) / 2;
  if (u >= 0 && u < w && v >= 0 && v < d) {
    return 1;
  }
  if (cx >= 0 && cx < w * hw) {
    const top = d * hh + cx * 0.5;
    return cy >= top && cy < top + h ? 2 : 0;
  }
  if (cx >= w * hw && cx < (w + d) * hw) {
    const top = (w + d) * hh - (cx - w * hw) * 0.5;
    return cy >= top && cy < top + h ? 3 : 0;
  }
  return 0;
}

export function isoBox(w: number, d: number, h: number, colors: BoxColors): Pixels {
  const { width, height } = boxSize(w, d, h);
  const faces: Face[] = [];
  for (let y = 0; y < height; y += 1) {
    for (let x = 0; x < width; x += 1) {
      faces.push(faceAt(x, y, w, d, h));
    }
  }
  const at = (x: number, y: number): Face =>
    x < 0 || y < 0 || x >= width || y >= height ? 0 : (faces[y * width + x] ?? 0);
  const pixels = new Pixels(width, height);
  for (let y = 0; y < height; y += 1) {
    for (let x = 0; x < width; x += 1) {
      const face = at(x, y);
      if (face === 0) {
        continue;
      }
      const edge =
        at(x - 1, y) === 0 || at(x + 1, y) === 0 || at(x, y - 1) === 0 || at(x, y + 1) === 0;
      const color = face === 1 ? colors.top : face === 2 ? colors.left : colors.right;
      pixels.set(x, y, edge ? colors.line : color);
    }
  }
  return pixels;
}
