import { COLOR } from "./palette";
import { drawText, GLYPH_H, sanitizeText, textWidth } from "./pixel-font";
import { Pixels } from "./pixels";

export const MAX_HANDLE_LENGTH = 32;
export const MAX_BUBBLE_TEXT = 28;
const VIP_TAG_W = 13;

function roundedBox(width: number, height: number, fill: number, border: number): Pixels {
  const pixels = new Pixels(width, height);
  pixels.fillRect(0, 0, width, height, border);
  pixels.fillRect(1, 1, width - 2, height - 2, fill);
  for (const [x, y] of [
    [0, 0],
    [width - 1, 0],
    [0, height - 1],
    [width - 1, height - 1],
  ] as const) {
    pixels.data.fill(0, (y * width + x) * 4, (y * width + x) * 4 + 4);
  }
  return pixels;
}

export function labelPixels(handle: string, vip: boolean): Pixels {
  const text = sanitizeText(handle, MAX_HANDLE_LENGTH);
  const tagSpace = vip ? VIP_TAG_W + 2 : 0;
  const pixels = roundedBox(textWidth(text) + 6 + tagSpace, GLYPH_H + 4, COLOR.ink, COLOR.line);
  if (vip) {
    pixels.fillRect(1, 1, VIP_TAG_W, GLYPH_H + 2, COLOR.amber);
    drawText(pixels, "VIP", 2, 2, COLOR.ink);
  }
  drawText(pixels, text, 3 + tagSpace, 2, COLOR.ivory);
  return pixels;
}

export function bubblePixels(text: string): Pixels {
  const clean = sanitizeText(text, MAX_BUBBLE_TEXT);
  const width = textWidth(clean) + 6;
  const body = roundedBox(width, GLYPH_H + 6, COLOR.ivory, COLOR.ivory);
  const pixels = new Pixels(width, GLYPH_H + 9);
  pixels.blit(body, 0, 0);
  drawText(pixels, clean, 3, 3, COLOR.ink);
  const tailX = Math.floor(width / 2) - 1;
  pixels.fillRect(tailX, GLYPH_H + 6, 3, 1, COLOR.ivory);
  pixels.fillRect(tailX + 1, GLYPH_H + 7, 1, 1, COLOR.ivory);
  return pixels;
}

export function pillPixels(text: string, fg: number, border: number): Pixels {
  const clean = sanitizeText(text, 40);
  const pixels = roundedBox(textWidth(clean) + 6, GLYPH_H + 4, COLOR.ink, border);
  drawText(pixels, clean, 3, 2, fg);
  return pixels;
}
