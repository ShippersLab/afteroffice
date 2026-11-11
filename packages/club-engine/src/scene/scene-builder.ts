import { Container, Graphics, Sprite, type Texture } from "pixi.js";
import { feetDepth, tileCenter, tileToScreen } from "../mathematics/iso";
import { sponsorFor } from "../sponsors";
import { pillPixels } from "../sprites/label-art";
import { COLOR } from "../sprites/palette";
import { type Pixels, scaled } from "../sprites/pixels";
import { cachedTexture } from "../sprites/textures";
import {
  DOOR_TILE,
  GRID_SIZE,
  isDanceTile,
  isVipTile,
  rectTiles,
  VIP_GAP_ROW,
  VIP_RECT,
  ZONE_RECTS,
} from "../state/layout";
import { discoBallPixels } from "./disco-ball-art";
import { discPixels, floorTile, glowTile, WALL_H, WALL_SPAN, wallStrip } from "./floor-art";
import { furnitureItems } from "./furniture";
import { PLACEMENTS, type PlacementId, signTexturePixels } from "./placements";
import { doorPixels, postPixels, ropePixels, stoolPixels } from "./props";
import { BALL_POSITION, type GlowTile, SceneFx } from "./scene-fx";

export type ClubScene = {
  readonly root: Container;
  readonly things: Container;
  readonly overlay: Container;
  readonly fx: SceneFx;
};

function sprite(texture: Texture, x: number, y: number, ax = 0, ay = 0): Sprite {
  const result = new Sprite(texture);
  result.anchor.set(ax, ay);
  result.position.set(Math.round(x), Math.round(y));
  return result;
}

function makeClickable(
  sign: Sprite,
  href: string,
  onNavigate: ((href: string) => void) | undefined,
): void {
  if (!onNavigate) return;
  sign.eventMode = "static";
  sign.cursor = "pointer";
  sign.on("pointertap", () => onNavigate(href));
}

function buildFloor(floor: Container, glow: Container): GlowTile[] {
  const textures = {
    a: cachedTexture("floor-a", () => floorTile(COLOR.velvet, COLOR.line)),
    b: cachedTexture("floor-b", () => floorTile(COLOR.panel, COLOR.line)),
    danceA: cachedTexture("dance-a", () => floorTile(COLOR.haze, COLOR.line)),
    danceB: cachedTexture("dance-b", () => floorTile(0x2a1550, COLOR.line)),
    vipA: cachedTexture("vip-a", () => floorTile(0x4a1f5e, COLOR.magenta)),
    vipB: cachedTexture("vip-b", () => floorTile(0x3a1650, COLOR.magenta)),
    glowM: cachedTexture("glow-m", () => glowTile(COLOR.magenta)),
    glowC: cachedTexture("glow-c", () => glowTile(COLOR.cyan)),
  };
  const glowTiles: GlowTile[] = [];
  for (let y = 0; y < GRID_SIZE; y += 1) {
    for (let x = 0; x < GRID_SIZE; x += 1) {
      const parity = (x + y) % 2;
      const tile = { x, y };
      const kind = isVipTile(tile) ? "vip" : isDanceTile(tile) ? "dance" : "floor";
      const texture =
        kind === "vip"
          ? parity === 0
            ? textures.vipA
            : textures.vipB
          : kind === "dance"
            ? parity === 0
              ? textures.danceA
              : textures.danceB
            : parity === 0
              ? textures.a
              : textures.b;
      const origin = tileToScreen(x, y);
      floor.addChild(sprite(texture, origin.x, origin.y, 0.5, 0));
      if (kind === "dance") {
        const glowSprite = sprite(
          parity === 0 ? textures.glowM : textures.glowC,
          origin.x,
          origin.y,
          0.5,
          0,
        );
        glowSprite.blendMode = "add";
        glow.addChild(glowSprite);
        glowTiles.push({ sprite: glowSprite, parity });
      }
    }
  }
  return glowTiles;
}

function wallDecal(
  back: Container,
  side: "right" | "left",
  u: number,
  lift: number,
  id: PlacementId,
  onNavigate: ((href: string) => void) | undefined,
  logos: ReadonlyMap<string, Pixels> | undefined,
): void {
  const spec = PLACEMENTS[id];
  const sponsor = sponsorFor(id);
  const logo = logos?.get(id);
  const shear = side === "right" ? 0.5 : -0.5;
  const texture = cachedTexture(`placement-${id}-${side}-${sponsor.name || "empty"}`, () =>
    signTexturePixels(spec, shear, sponsor.name, logo),
  );
  const baseX = side === "right" ? u * 40 : -u * 40;
  const baseY = u * 20;
  const height = spec.gridH * spec.scale;
  const sign = sprite(texture, baseX, baseY - lift - height / 2, 0.5, 0.5);
  makeClickable(sign, sponsor.href, onNavigate);
  back.addChild(sign);
  back.addChild(sponsoredLabel(baseX, baseY - lift + 14, 2));
}

function sponsoredLabel(x: number, y: number, scale: number): Sprite {
  const texture = cachedTexture(`sponsored-${scale}`, () =>
    scaled(pillPixels("SPONSORED", COLOR.amber, COLOR.amber), scale),
  );
  return sprite(texture, x, y, 0.5, 0.5);
}

function buildWalls(
  back: Container,
  onNavigate: ((href: string) => void) | undefined,
  logos: ReadonlyMap<string, Pixels> | undefined,
): void {
  const right = cachedTexture("wall-right", () => wallStrip("right"));
  const left = cachedTexture("wall-left", () => wallStrip("left"));
  back.addChild(sprite(right, 0, -WALL_H));
  back.addChild(sprite(left, -WALL_SPAN, -WALL_H));
  wallDecal(back, "right", 6, 45, "billboard", onNavigate, logos);
  wallDecal(back, "right", 12, 70, "neon", onNavigate, logos);
  wallDecal(back, "left", 5.5, 40, "sponsor-slot", onNavigate, logos);
  wallDecal(back, "left", 11, 45, "poster", onNavigate, logos);
  const door = cachedTexture("door", () => scaled(doorPixels(), 3, -0.5));
  const doorU = DOOR_TILE.y + 0.7;
  back.addChild(sprite(door, -doorU * 40, doorU * 20 - 51 - 4, 0.5, 0.5));
}

function buildFurniture(things: Container): void {
  for (const item of furnitureItems()) {
    const texture = cachedTexture(`furniture-${item.key}`, item.build);
    const piece = sprite(texture, item.x, item.y);
    piece.zIndex = item.z;
    things.addChild(piece);
  }
  const barRect = ZONE_RECTS.bar[0];
  const sign = tileToScreen(barRect.x + barRect.w / 2, barRect.y - 2);
  const barSign = sponsoredLabel(sign.x, sign.y - 24, 1);
  barSign.zIndex = feetDepth(barRect.x, barRect.y) - 30;
  things.addChild(barSign);
  const stool = cachedTexture("stool", stoolPixels);
  for (const rect of ZONE_RECTS.bar) {
    for (const tile of rectTiles(rect)) {
      const center = tileCenter(tile.x, tile.y);
      const piece = sprite(stool, center.x, center.y + 8, 0.5, 1);
      piece.scale.set(3);
      piece.zIndex = feetDepth(tile.x, tile.y) - 1;
      things.addChild(piece);
    }
  }
}

function buildVipRopes(things: Container): void {
  const post = cachedTexture("post", postPixels);
  const ropeRight = cachedTexture("rope-dr", () => ropePixels("down-right"));
  const ropeLeft = cachedTexture("rope-dl", () => ropePixels("down-left"));
  const left = VIP_RECT.x;
  const right = VIP_RECT.x + VIP_RECT.w;
  const front = VIP_RECT.y + VIP_RECT.h;
  const vertices: { x: number; y: number }[] = [];
  for (let y = VIP_RECT.y; y <= front; y += 1) {
    vertices.push({ x: left, y });
  }
  for (let x = left + 1; x <= right; x += 1) {
    vertices.push({ x, y: front });
  }
  for (const v of vertices) {
    const p = tileToScreen(v.x, v.y);
    const piece = sprite(post, p.x, p.y, 0.5, 1);
    piece.scale.set(2);
    piece.zIndex = (v.x + v.y) * 20;
    things.addChild(piece);
  }
  for (let x = left; x < right; x += 1) {
    const p = tileToScreen(x, front);
    const piece = sprite(ropeRight, p.x, p.y - 18);
    piece.zIndex = (x + front + 1) * 20 - 1;
    things.addChild(piece);
  }
  for (let y = VIP_RECT.y; y < front; y += 1) {
    if (y === VIP_GAP_ROW) {
      continue;
    }
    const p = tileToScreen(left, y + 1);
    const piece = sprite(ropeLeft, p.x, p.y - 18 - 20);
    piece.zIndex = (left + y + 1) * 20 - 1;
    things.addChild(piece);
  }
}

export function buildScene(
  onNavigate?: (href: string) => void,
  logos?: ReadonlyMap<string, Pixels>,
): ClubScene {
  const root = new Container();
  const back = new Container();
  const floor = new Container();
  const glow = new Container();
  const things = new Container();
  const top = new Container();
  const overlay = new Container();
  things.sortableChildren = true;
  back.interactiveChildren = true;
  top.interactiveChildren = true;
  for (const layer of [back, floor, glow, things, top, overlay]) {
    root.addChild(layer);
  }
  for (const layer of [floor, glow, things, overlay]) {
    layer.interactiveChildren = false;
  }
  buildWalls(back, onNavigate, logos);
  const glowTiles = buildFloor(floor, glow);
  buildFurniture(things);
  buildVipRopes(things);
  const spotTexture = cachedTexture("spot", () => discPixels(24, 12, COLOR.strobe));
  const spots = [COLOR.magenta, COLOR.cyan, COLOR.ultraviolet].map((color) => {
    const spot = sprite(spotTexture, 0, 0, 0.5, 0.5);
    spot.scale.set(3);
    spot.tint = color;
    spot.alpha = 0.22;
    spot.blendMode = "add";
    glow.addChild(spot);
    return spot;
  });
  const beams = new Graphics();
  glow.addChildAt(beams, 0);
  const first = cachedTexture("ball-0", () => discoBallPixels(0));
  const ballFrames: readonly [Texture, Texture] = [
    first,
    cachedTexture("ball-1", () => discoBallPixels(1)),
  ];
  const cord = new Graphics().rect(-1, -WALL_H, 2, BALL_POSITION.y + WALL_H - 24).fill(COLOR.lilac);
  const ball = sprite(first, BALL_POSITION.x, BALL_POSITION.y, 0.5, 0.5);
  ball.scale.set(4);
  top.addChild(cord, ball);
  const ballSpec = PLACEMENTS.ball;
  const ballSponsor = sponsorFor("ball");
  const ballLogo = logos?.get("ball");
  const pill = cachedTexture(`placement-ball-${ballSponsor.name || "empty"}`, () =>
    signTexturePixels(ballSpec, 0, ballSponsor.name, ballLogo),
  );
  const pillSprite = sprite(pill, 0, BALL_POSITION.y + 46, 0.5, 0.5);
  makeClickable(pillSprite, ballSponsor.href, onNavigate);
  top.addChild(pillSprite);
  top.addChild(sponsoredLabel(0, BALL_POSITION.y + 70, 2));
  return { root, things, overlay, fx: new SceneFx({ glowTiles, spots, beams, ball, ballFrames }) };
}
