import type { MomentKind } from "../state/social";
import { bubblePixels } from "./label-art";
import { COLOR } from "./palette";
import { Pixels } from "./pixels";

const HEART: readonly string[] = [".oo.oo.", "oRRoRRo", "oRRRRRo", ".oRRRo.", "..oRo..", "...o..."];

const STAR: readonly string[] = [
  "...o...",
  "..oYo..",
  "ooYYYoo",
  "oYYYYYo",
  ".oYYYo.",
  ".oYoYo.",
  "..o.o..",
];

export function momentPixels(kind: MomentKind): Pixels {
  switch (kind) {
    case "pair":
      return Pixels.fromGrid(HEART, { o: COLOR.ink, R: COLOR.magenta });
    case "cheer":
      return Pixels.fromGrid(STAR, { o: COLOR.ink, Y: COLOR.amber });
    case "wave":
      return bubblePixels("HI");
    default: {
      const unhandled: never = kind;
      throw new Error(`Unhandled moment: ${String(unhandled)}`);
    }
  }
}

export function ringPixels(): Pixels {
  const width = 25;
  const height = 13;
  const pixels = new Pixels(width, height);
  for (let y = 0; y < height; y += 1) {
    for (let x = 0; x < width; x += 1) {
      const dx = (x + 0.5 - width / 2) / (width / 2);
      const dy = (y + 0.5 - height / 2) / (height / 2);
      const radius = dx * dx + dy * dy;
      if (radius <= 1 && radius >= 0.68) {
        pixels.set(x, y, COLOR.strobe);
      }
    }
  }
  return pixels;
}
