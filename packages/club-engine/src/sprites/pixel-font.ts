import { Pixels } from "./pixels";

const RAW: Readonly<Record<string, string>> = {
  A: ".#.|#.#|###|#.#|#.#",
  B: "##.|#.#|##.|#.#|##.",
  C: ".##|#..|#..|#..|.##",
  D: "##.|#.#|#.#|#.#|##.",
  E: "###|#..|##.|#..|###",
  F: "###|#..|##.|#..|#..",
  G: ".##|#..|#.#|#.#|.##",
  H: "#.#|#.#|###|#.#|#.#",
  I: "###|.#.|.#.|.#.|###",
  J: "..#|..#|..#|#.#|.#.",
  K: "#.#|#.#|##.|#.#|#.#",
  L: "#..|#..|#..|#..|###",
  M: "#.#|###|###|#.#|#.#",
  N: "##.|#.#|#.#|#.#|#.#",
  O: ".#.|#.#|#.#|#.#|.#.",
  P: "##.|#.#|##.|#..|#..",
  Q: ".#.|#.#|#.#|##.|.##",
  R: "##.|#.#|##.|#.#|#.#",
  S: ".##|#..|.#.|..#|##.",
  T: "###|.#.|.#.|.#.|.#.",
  U: "#.#|#.#|#.#|#.#|###",
  V: "#.#|#.#|#.#|#.#|.#.",
  W: "#.#|#.#|###|###|#.#",
  X: "#.#|#.#|.#.|#.#|#.#",
  Y: "#.#|#.#|.#.|.#.|.#.",
  Z: "###|..#|.#.|#..|###",
  "0": "###|#.#|#.#|#.#|###",
  "1": ".#.|##.|.#.|.#.|###",
  "2": "##.|..#|.#.|#..|###",
  "3": "##.|..#|.#.|..#|##.",
  "4": "#.#|#.#|###|..#|..#",
  "5": "###|#..|##.|..#|##.",
  "6": ".##|#..|###|#.#|###",
  "7": "###|..#|.#.|.#.|.#.",
  "8": "###|#.#|###|#.#|###",
  "9": "###|#.#|###|..#|##.",
  "-": "...|...|###|...|...",
  _: "...|...|...|...|###",
  ".": "...|...|...|...|.#.",
  ",": "...|...|...|.#.|#..",
  "!": ".#.|.#.|.#.|...|.#.",
  "?": "##.|..#|.#.|...|.#.",
  "'": ".#.|.#.|...|...|...",
  ":": "...|.#.|...|.#.|...",
  " ": "...|...|...|...|...",
};

export const GLYPH_W = 3;
export const GLYPH_H = 5;
export const GLYPH_ADVANCE = 4;

export function sanitizeText(text: string, maxLength: number): string {
  const upper = text.toUpperCase().slice(0, maxLength);
  let out = "";
  for (const char of upper) {
    out += RAW[char] === undefined ? "?" : char;
  }
  return out;
}

export function textWidth(text: string): number {
  return text.length === 0 ? 0 : text.length * GLYPH_ADVANCE - 1;
}

export function drawText(target: Pixels, text: string, x: number, y: number, color: number): void {
  let cursor = x;
  for (const char of text) {
    const rows = (RAW[char] ?? RAW["?"] ?? "").split("|");
    rows.forEach((row, gy) => {
      for (let gx = 0; gx < GLYPH_W; gx += 1) {
        if (row.charAt(gx) === "#") {
          target.set(cursor + gx, y + gy, color);
        }
      }
    });
    cursor += GLYPH_ADVANCE;
  }
}

export function textPixels(text: string, color: number): Pixels {
  const pixels = new Pixels(Math.max(1, textWidth(text)), GLYPH_H);
  drawText(pixels, text, 0, 0, color);
  return pixels;
}
