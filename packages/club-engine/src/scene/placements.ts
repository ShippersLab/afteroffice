import { COLOR } from "../sprites/palette";
import { drawText, GLYPH_H, textWidth } from "../sprites/pixel-font";
import { Pixels, scaled } from "../sprites/pixels";

export type PlacementId = "billboard" | "sponsor-slot" | "poster" | "neon" | "bar";

export type PlacementSpec = {
  readonly id: PlacementId;
  readonly gridW: number;
  readonly gridH: number;
  readonly lines: readonly string[];
  readonly scale: number;
};

export const PLACEMENTS: Readonly<Record<PlacementId, PlacementSpec>> = {
  billboard: { id: "billboard", gridW: 48, gridH: 32, lines: ["YOUR", "BRAND", "HERE"], scale: 3 },
  "sponsor-slot": {
    id: "sponsor-slot",
    gridW: 24,
    gridH: 32,
    lines: ["YOUR", "BRAND", "HERE"],
    scale: 3,
  },
  poster: { id: "poster", gridW: 21, gridH: 28, lines: ["YOUR", "BRAND", "HERE"], scale: 3 },
  neon: { id: "neon", gridW: 64, gridH: 12, lines: ["YOUR BRAND HERE"], scale: 2 },
  bar: { id: "bar", gridW: 44, gridH: 9, lines: ["YOUR BRAND"], scale: 2 },
};

export function placeholderPixels(spec: PlacementSpec): Pixels {
  const pixels = new Pixels(spec.gridW, spec.gridH);
  pixels.fillRect(0, 0, spec.gridW, spec.gridH, COLOR.amber);
  pixels.fillRect(1, 1, spec.gridW - 2, spec.gridH - 2, COLOR.ink);
  const lineStep = 7;
  const block = spec.lines.length * lineStep - 2;
  const startY = Math.floor((spec.gridH - block) / 2);
  spec.lines.forEach((line, index) => {
    const x = Math.floor((spec.gridW - textWidth(line)) / 2);
    drawText(pixels, line, x, startY + index * lineStep, COLOR.ivory);
  });
  return pixels;
}

export function sponsorSignPixels(name: string, spec: PlacementSpec, logo?: Pixels): Pixels {
  const pixels = new Pixels(spec.gridW, spec.gridH);
  pixels.fillRect(0, 0, spec.gridW, spec.gridH, COLOR.accent);
  if (logo) {
    const x = Math.floor((spec.gridW - logo.width) / 2);
    const y = Math.floor((spec.gridH - logo.height) / 2);
    pixels.blit(logo, x, y);
    return pixels;
  }
  const text = name.toUpperCase();
  const x = Math.floor((spec.gridW - textWidth(text)) / 2);
  const y = Math.floor((spec.gridH - GLYPH_H) / 2);
  drawText(pixels, text, x, y, COLOR.ink);
  return pixels;
}

export function signTexturePixels(
  spec: PlacementSpec,
  shear: number,
  name: string,
  logo?: Pixels,
): Pixels {
  const base = name.length > 0 ? sponsorSignPixels(name, spec, logo) : placeholderPixels(spec);
  return scaled(base, spec.scale, shear);
}
