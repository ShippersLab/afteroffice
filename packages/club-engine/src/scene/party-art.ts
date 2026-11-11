import { hashString } from "../mathematics/rng";
import { COLOR } from "../sprites/palette";
import { Pixels } from "../sprites/pixels";

export const EQ_W = 26;
export const EQ_H = 15;
export const EQ_FRAMES = 6;
const BAR_COUNT = 6;
const BAR_COLORS = [COLOR.magenta, COLOR.cyan, COLOR.laser, COLOR.amber, COLOR.cyan, COLOR.magenta];

export function equalizerPixels(frame: number): Pixels {
  const pixels = new Pixels(EQ_W, EQ_H);
  pixels.fillRect(0, 0, EQ_W, EQ_H, COLOR.line);
  pixels.fillRect(1, 1, EQ_W - 2, EQ_H - 2, COLOR.ink);
  for (let bar = 0; bar < BAR_COUNT; bar += 1) {
    const height = 2 + (hashString(`eq-${bar}-${frame}`) % (EQ_H - 5));
    const x = 3 + bar * 4;
    const color = BAR_COLORS[bar] ?? COLOR.magenta;
    for (let row = 0; row < height; row += 1) {
      pixels.fillRect(x, EQ_H - 3 - row, 3, 1, row >= height - 2 ? COLOR.strobe : color);
    }
  }
  return pixels;
}

export function dotPixels(): Pixels {
  const pixels = new Pixels(1, 1);
  pixels.set(0, 0, COLOR.strobe);
  return pixels;
}
