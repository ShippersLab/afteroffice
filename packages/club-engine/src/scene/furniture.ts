import { feetDepth, TILE_H, TILE_W, tileToScreen } from "../mathematics/iso";
import { sponsorFor } from "../sponsors";
import { COLOR } from "../sprites/palette";
import { type Pixels, scaled } from "../sprites/pixels";
import { discPixels, floorTile } from "./floor-art";
import { type BoxColors, isoBox } from "./iso-box";
import { PLACEMENTS, placeholderPixels, sponsorSignPixels } from "./placements";

export type FurnitureItem = {
  readonly key: string;
  readonly x: number;
  readonly y: number;
  readonly z: number;
  readonly build: () => Pixels;
};

const WOOD: BoxColors = { top: 0x6049cf, left: 0x41309a, right: 0x2e2552, line: COLOR.ink };
const BOOTH: BoxColors = { top: 0x41309a, left: COLOR.line, right: COLOR.velvet, line: COLOR.ink };
const SPEAKER: BoxColors = {
  top: COLOR.line,
  left: COLOR.velvet,
  right: COLOR.panel,
  line: COLOR.ink,
};
const SOFA: BoxColors = { top: 0xb02a74, left: 0x8c1f5c, right: 0x5e1540, line: COLOR.ink };

function boxItem(
  key: string,
  tx: number,
  ty: number,
  dims: { w: number; d: number; h: number },
  colors: BoxColors,
  z: number,
  decorate?: (box: Pixels) => void,
): FurnitureItem {
  const origin = tileToScreen(tx, ty);
  return {
    key,
    x: Math.round(origin.x - (dims.d * TILE_W) / 2),
    y: Math.round(origin.y - dims.h),
    z,
    build: () => {
      const box = isoBox(dims.w, dims.d, dims.h, colors);
      decorate?.(box);
      return box;
    },
  };
}

function topPoint(d: number, u: number, v: number): { x: number; y: number } {
  return {
    x: Math.round((d + u - v) * (TILE_W / 2)),
    y: Math.round((u + v) * (TILE_H / 2)),
  };
}

function decorateBooth(box: Pixels): void {
  const deck = discPixels(16, 8, COLOR.lilac);
  deck.fillRect(7, 3, 2, 2, COLOR.ink);
  for (const u of [0.5, 2.5]) {
    const p = topPoint(1, u, 0.5);
    box.blit(deck, p.x - 8, p.y - 4);
  }
  for (let cx = 20; cx < 110; cx += 10) {
    const color = (cx / 10) % 2 === 0 ? COLOR.magenta : COLOR.cyan;
    box.fillRect(cx, 20 + Math.floor(cx / 2) + 10, 2, 2, color);
  }
}

function decorateSpeaker(box: Pixels): void {
  box.blit(discPixels(14, 9, COLOR.ink), 13, 30, { shear: 0.5 });
  box.blit(discPixels(6, 4, COLOR.line), 17, 33, { shear: 0.5 });
}

const BAR_SIGN = { x: 72, y: 54 };
const BOTTLE_COLORS = [COLOR.cyan, COLOR.magenta, COLOR.lilac, COLOR.cyan, COLOR.magenta] as const;

function decorateBar(box: Pixels): void {
  BOTTLE_COLORS.forEach((color, index) => {
    const p = topPoint(1, index + 0.5, 0.5);
    box.fillRect(p.x - 2, p.y - 9, 4, 8, color);
    box.fillRect(p.x - 1, p.y - 12, 2, 3, color);
    box.fillRect(p.x - 2, p.y - 9, 1, 8, COLOR.ink);
  });
  const sponsor = sponsorFor("bar");
  const sign =
    sponsor.name.length > 0
      ? sponsorSignPixels(sponsor.name, PLACEMENTS.bar)
      : placeholderPixels(PLACEMENTS.bar);
  box.blit(sign, BAR_SIGN.x, BAR_SIGN.y, { scale: 2, shear: 0.5 });
}

function decorateVipBar(box: Pixels): void {
  for (const [index, color] of [COLOR.cyan, COLOR.magenta].entries()) {
    const p = topPoint(1, index + 0.5, 0.5);
    box.fillRect(p.x - 2, p.y - 8, 3, 7, color);
  }
}

function decoratePool(box: Pixels): void {
  const center = topPoint(2, 1.5, 1);
  const felt = scaled(floorTile(COLOR.laser, COLOR.laser), 2);
  box.blit(felt, center.x - felt.width / 2, center.y - felt.height / 2);
  box.fillRect(center.x - 2, center.y - 2, 4, 4, COLOR.ivory);
  box.fillRect(center.x + 10, center.y + 4, 4, 4, COLOR.cyan);
  box.fillRect(center.x - 14, center.y + 8, 4, 4, COLOR.amber);
}

function decorateArcade(box: Pixels): void {
  box.blit(discPixels(16, 11, COLOR.ink), 11, 20, { scale: 2, shear: 0.5 });
  box.blit(discPixels(11, 7, COLOR.cyan), 16, 23, { scale: 2, shear: 0.5 });
  box.fillRect(53, 47, 10, 2, COLOR.magenta);
  box.fillRect(54, 52, 8, 2, COLOR.cyan);
}

function sofaItems(prefix: string, tx: number, ty: number, d: number, z: number): FurnitureItem[] {
  return [
    boxItem(`${prefix}-back`, tx, ty, { w: 0.4, d, h: 40 }, SOFA, z - 1),
    boxItem(`${prefix}-seat`, tx + 0.4, ty, { w: 0.6, d, h: 22 }, SOFA, z),
  ];
}

export function furnitureItems(): FurnitureItem[] {
  return [
    boxItem("booth", 2, 1, { w: 4, d: 1, h: 30 }, BOOTH, feetDepth(2, 1), decorateBooth),
    boxItem("speaker", 1, 1, { w: 1, d: 1, h: 40 }, SPEAKER, feetDepth(1, 1), decorateSpeaker),
    boxItem("speaker", 6, 1, { w: 1, d: 1, h: 40 }, SPEAKER, feetDepth(6, 1), decorateSpeaker),
    boxItem("bar", 9, 2, { w: 5, d: 1, h: 30 }, WOOD, feetDepth(9, 2), decorateBar),
    ...sofaItems("sofa-a", 0, 6, 3, feetDepth(0, 6)),
    ...sofaItems("sofa-b", 0, 10, 3, feetDepth(0, 10)),
    boxItem("vip-sofa", 14, 0, { w: 2, d: 1, h: 36 }, SOFA, feetDepth(14, 0)),
    boxItem("vip-bar", 16, 0, { w: 1, d: 1, h: 26 }, WOOD, feetDepth(16, 0), decorateVipBar),
    boxItem("pool-table", 13, 13, { w: 3, d: 2, h: 22 }, WOOD, feetDepth(13, 13), decoratePool),
    boxItem("arcade", 16, 13, { w: 1, d: 1, h: 44 }, BOOTH, feetDepth(16, 13), decorateArcade),
  ];
}
