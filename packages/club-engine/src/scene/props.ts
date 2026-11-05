import { COLOR } from "../sprites/palette";
import { drawText } from "../sprites/pixel-font";
import { Pixels } from "../sprites/pixels";

const STOOL: readonly string[] = [
  ".ooooo.",
  "oMMMMMo",
  "oMmmmMo",
  ".ooooo.",
  "...o...",
  "...o...",
  "..ooo..",
];

const POST: readonly string[] = [
  ".oo.",
  "oCCo",
  "oCCo",
  ".oo.",
  ".ll.",
  ".ll.",
  ".ll.",
  ".ll.",
  ".ll.",
  "oooo",
];

export function stoolPixels(): Pixels {
  return Pixels.fromGrid(STOOL, { o: COLOR.ink, M: COLOR.magenta, m: 0xb02a74 });
}

export function postPixels(): Pixels {
  return Pixels.fromGrid(POST, { o: COLOR.ink, C: COLOR.lilac, l: COLOR.muted });
}

export function ropePixels(direction: "down-right" | "down-left"): Pixels {
  const pixels = new Pixels(41, 25);
  for (let x = 0; x <= 40; x += 1) {
    const y = Math.floor(x / 2) + Math.round(Math.sin((x / 40) * Math.PI) * 3);
    const px = direction === "down-right" ? x : 40 - x;
    pixels.set(px, y, COLOR.magenta);
    pixels.set(px, y + 1, COLOR.magenta);
  }
  return pixels;
}

export function doorPixels(): Pixels {
  const pixels = new Pixels(22, 34);
  pixels.fillRect(0, 0, 22, 34, COLOR.ink);
  pixels.fillRect(1, 1, 20, 33, COLOR.lilac);
  pixels.fillRect(3, 9, 16, 25, COLOR.haze);
  pixels.fillRect(14, 22, 2, 2, COLOR.ivory);
  pixels.fillRect(3, 9, 16, 1, COLOR.ink);
  drawText(pixels, "ENTER", 2, 3, COLOR.ink);
  return pixels;
}
