import { Container, Graphics, Sprite, type Texture } from "pixi.js";
import { feetDepth, tileCenter, tileToScreen } from "../mathematics/iso";
import { pillPixels } from "../sprites/label-art";
import { COLOR } from "../sprites/palette";
import { scaled } from "../sprites/pixels";
import { cachedTexture } from "../sprites/textures";
import { GRID_SIZE, isDanceTile, isVipTile, rectTiles, ZONE_RECTS } from "../state/layout";
import { discoBallPixels } from "./disco-ball-art";
import { discPixels, floorTile, glowTile, WALL_H, WALL_SPAN, wallStrip } from "./floor-art";
import { furnitureItems } from "./furniture";
import { PLACEMENTS, type PlacementId, placementTexturePixels } from "./placements";
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
): void {
  const spec = PLACEMENTS[id];
  const shear = side === "right" ? 0.5 : -0.5;
  const texture = cachedTexture(`placement-${id}-${side}`, () =>
    placementTexturePixels(spec, shear),
  );
  const baseX = side === "right" ? u * 40 : -u * 40;
  const baseY = u * 20;
  const height = spec.gridH * spec.scale;
  back.addChild(sprite(texture, baseX, baseY - lift - height / 2, 0.5, 0.5));
  back.addChild(sponsoredLabel(baseX, baseY - lift + 14, 2));
}

function sponsoredLabel(x: number, y: number, scale: number): Sprite {
  const texture = cachedTexture(`sponsored-${scale}`, () =>
    scaled(pillPixels("SPONSORED", COLOR.amber, COLOR.amber), scale),
  );
  return sprite(texture, x, y, 0.5, 0.5);
}

function buildWalls(back: Container): void {
  const right = cachedTexture("wall-right", () => wallStrip("right"));
  const left = cachedTexture("wall-left", () => wallStrip("left"));
  back.addChild(sprite(right, 0, -WALL_H));
  back.addChild(sprite(left, -WALL_SPAN, -WALL_H));
  wallDecal(back, "right", 6, 45, "billboard");
  wallDecal(back, "right", 10.5, 70, "neon");
  wallDecal(back, "left", 5.5, 40, "sponsor-slot");
  wallDecal(back, "left", 10, 45, "poster");
  const door = cachedTexture("door", () => scaled(doorPixels(), 3, -0.5));
  back.addChild(sprite(door, -12.7 * 40, 12.7 * 20 - 51 - 4, 0.5, 0.5));
}

function buildFurniture(things: Container): void {
  for (const item of furnitureItems()) {
    const texture = cachedTexture(`furniture-${item.key}`, item.build);
    const piece = sprite(texture, item.x, item.y);
    piece.zIndex = item.z;
    things.addChild(piece);
  }
  const barSign = sponsoredLabel(340, 150 + 95, 1);
  barSign.zIndex = 201;
  things.addChild(barSign);
  const stool = cachedTexture("stool", stoolPixels);
  for (const tile of rectTiles(ZONE_RECTS.bar[0])) {
    const center = tileCenter(tile.x, tile.y);
    const piece = sprite(stool, center.x, center.y + 8, 0.5, 1);
    piece.scale.set(3);
    piece.zIndex = feetDepth(tile.x, tile.y) - 1;
    things.addChild(piece);
  }
}

function buildVipRopes(things: Container): void {
  const post = cachedTexture("post", postPixels);
  const ropeRight = cachedTexture("rope-dr", () => ropePixels("down-right"));
  const ropeLeft = cachedTexture("rope-dl", () => ropePixels("down-left"));
  const vertices = [
    ...[10, 11, 12, 13, 14].map((y) => ({ x: 10, y })),
    ...[11, 12, 13, 14].map((x) => ({ x, y: 10 })),
  ];
  for (const v of vertices) {
    const p = tileToScreen(v.x, v.y);
    const piece = sprite(post, p.x, p.y, 0.5, 1);
    piece.scale.set(2);
    piece.zIndex = (v.x + v.y) * 20;
    things.addChild(piece);
  }
  for (const x of [10, 11, 12, 13]) {
    const p = tileToScreen(x, 10);
    const piece = sprite(ropeRight, p.x, p.y - 18);
    piece.zIndex = (x + 11) * 20 - 1;
    things.addChild(piece);
  }
  for (const y of [10, 11, 13]) {
    const p = tileToScreen(10, y + 1);
    const piece = sprite(ropeLeft, p.x, p.y - 18 - 20);
    piece.zIndex = (11 + y) * 20 - 1;
    things.addChild(piece);
  }
}

export function buildScene(): ClubScene {
  const root = new Container();
  const back = new Container();
  const floor = new Container();
  const glow = new Container();
  const things = new Container();
  const top = new Container();
  const overlay = new Container();
  things.sortableChildren = true;
  for (const layer of [back, floor, glow, things, top, overlay]) {
    layer.interactiveChildren = false;
    root.addChild(layer);
  }
  buildWalls(back);
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
  const pill = cachedTexture("placement-ball", () => placementTexturePixels(ballSpec, 0));
  top.addChild(sprite(pill, 0, BALL_POSITION.y + 46, 0.5, 0.5));
  top.addChild(sponsoredLabel(0, BALL_POSITION.y + 70, 2));
  return { root, things, overlay, fx: new SceneFx({ glowTiles, spots, beams, ball, ballFrames }) };
}
