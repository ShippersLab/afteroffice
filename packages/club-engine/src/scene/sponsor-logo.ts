import { sponsorPlacements } from "../sponsors";
import { COLOR } from "../sprites/palette";
import { Pixels } from "../sprites/pixels";
import { PLACEMENTS, type PlacementSpec } from "./placements";

const LOGO_PADDING = 4;

function loadImage(url: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const image = new Image();
    image.addEventListener("load", () => resolve(image), { once: true });
    image.addEventListener(
      "error",
      () => reject(new Error(`Failed to load sponsor logo: ${url}`)),
      { once: true },
    );
    image.src = url;
  });
}

function rasterizeLogo(image: HTMLImageElement, width: number, height: number): Pixels {
  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const context = canvas.getContext("2d");
  if (!context) {
    throw new Error("Could not create a 2d context for the sponsor logo");
  }
  const scale = Math.min(width / image.width, height / image.height);
  const w = image.width * scale;
  const h = image.height * scale;
  context.drawImage(image, (width - w) / 2, (height - h) / 2, w, h);
  const data = context.getImageData(0, 0, width, height).data;
  const pixels = new Pixels(width, height);
  for (let y = 0; y < height; y += 1) {
    for (let x = 0; x < width; x += 1) {
      const alpha = data[(y * width + x) * 4 + 3] ?? 0;
      if (alpha > 128) {
        pixels.set(x, y, COLOR.ivory);
      }
    }
  }
  return pixels;
}

export async function loadSponsorLogos(): Promise<ReadonlyMap<string, Pixels>> {
  const specs = PLACEMENTS as Record<string, PlacementSpec | undefined>;
  const tasks = [...sponsorPlacements()].map(async ([placement, sponsor]) => {
    const spec = specs[placement];
    if (!sponsor.logo || !spec) {
      return undefined;
    }
    try {
      const image = await loadImage(sponsor.logo);
      return [
        placement,
        rasterizeLogo(image, spec.gridW - LOGO_PADDING * 2, spec.gridH - LOGO_PADDING * 2),
      ] as const;
    } catch {
      // Fall back to the text wordmark when the logo cannot be loaded.
      return undefined;
    }
  });
  const results = await Promise.all(tasks);
  const logos = new Map<string, Pixels>();
  for (const result of results) {
    if (result) {
      logos.set(result[0], result[1]);
    }
  }
  return logos;
}
