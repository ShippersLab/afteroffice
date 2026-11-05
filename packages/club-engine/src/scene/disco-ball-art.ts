import { hashString } from "../mathematics/rng";
import { COLOR } from "../sprites/palette";
import { Pixels } from "../sprites/pixels";

export const BALL_SIZE = 14;

const RAMP = [COLOR.strobe, 0xe9e1ff, 0xbdaeff, 0x8f79f2, 0x6049cf, 0x41309a] as const;

export function discoBallPixels(frame: number): Pixels {
  const pixels = new Pixels(BALL_SIZE, BALL_SIZE);
  const center = (BALL_SIZE - 1) / 2;
  const radius = BALL_SIZE / 2;
  for (let y = 0; y < BALL_SIZE; y += 1) {
    for (let x = 0; x < BALL_SIZE; x += 1) {
      const dx = x - center;
      const dy = y - center;
      const dist = Math.hypot(dx, dy);
      if (dist > radius) {
        continue;
      }
      if (dist > radius - 1) {
        pixels.set(x, y, COLOR.ink);
        continue;
      }
      const light = Math.hypot(x - 4, y - 4) / (radius * 1.7);
      const index = Math.min(RAMP.length - 1, Math.floor(light * RAMP.length));
      const checker = (x + y) % 2 === 0 ? 0 : 1;
      const shade = Math.min(RAMP.length - 1, index + checker);
      pixels.set(x, y, RAMP[shade] ?? COLOR.lilac);
      const hash = hashString(`${x},${y},${frame}`) % 9;
      if (hash === 0) {
        pixels.set(x, y, COLOR.magenta);
      } else if (hash === 1 && frame === 1) {
        pixels.set(x, y, COLOR.cyan);
      } else if (hash === 2 && frame === 0) {
        pixels.set(x, y, COLOR.cyan);
      }
    }
  }
  pixels.set(4, 3, COLOR.strobe);
  pixels.set(5, 3, COLOR.strobe);
  return pixels;
}
