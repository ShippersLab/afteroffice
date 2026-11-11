import { type Container, Graphics, Sprite, type Texture } from "pixi.js";
import { tileToScreen } from "../mathematics/iso";
import { COLOR } from "../sprites/palette";
import { scaled } from "../sprites/pixels";
import { cachedTexture } from "../sprites/textures";
import { ZONE_RECTS } from "../state/layout";
import { discPixels, glowTile } from "./floor-art";
import { dotPixels, EQ_FRAMES, EQ_H, equalizerPixels } from "./party-art";
import { PartyFx } from "./party-fx";
import { FLOOR_CENTER } from "./scene-fx";

const SPARKLE_COUNT = 22;
const EQ_U = 8.3;
const EQ_LIFT = 100;
const EQ_SCALE = 3;

export type PartyLayers = {
  readonly back: Container;
  readonly glow: Container;
  readonly top: Container;
  readonly speakers: readonly { readonly x: number; readonly y: number }[];
};

function placed(texture: Texture, x: number, y: number): Sprite {
  const result = new Sprite(texture);
  result.anchor.set(0.5);
  result.position.set(Math.round(x), Math.round(y));
  return result;
}

function buildEqualizer(back: Container): { sprite: Sprite; frames: Texture[] } {
  const frames = Array.from({ length: EQ_FRAMES }, (_, index) =>
    cachedTexture(`eq-${index}`, () => scaled(equalizerPixels(index), EQ_SCALE, -0.5)),
  );
  const first = frames[0];
  if (!first) {
    throw new Error("Equalizer frames missing");
  }
  const sprite = placed(first, -EQ_U * 40, EQ_U * 20 - EQ_LIFT - (EQ_H * EQ_SCALE) / 2);
  back.addChild(sprite);
  return { sprite, frames };
}

function buildSpeakerPulses(glow: Container, speakers: PartyLayers["speakers"]): Sprite[] {
  const cone = cachedTexture("speaker-pulse", () => discPixels(14, 9, COLOR.strobe));
  return speakers.map((speaker) => {
    const pulse = placed(cone, speaker.x + 20, speaker.y + 38);
    pulse.tint = COLOR.cyan;
    pulse.blendMode = "add";
    glow.addChild(pulse);
    return pulse;
  });
}

function buildBarGlow(glow: Container): Sprite[] {
  const texture = cachedTexture("glow-a", () => glowTile(COLOR.amber));
  const bar = ZONE_RECTS.bar[0];
  const sprites: Sprite[] = [];
  for (let row = bar.y; row <= bar.y + 1; row += 1) {
    for (let x = bar.x; x < bar.x + bar.w; x += 1) {
      const origin = tileToScreen(x, row);
      const sprite = new Sprite(texture);
      sprite.anchor.set(0.5, 0);
      sprite.position.set(origin.x, origin.y);
      sprite.blendMode = "add";
      glow.addChild(sprite);
      sprites.push(sprite);
    }
  }
  return sprites;
}

function buildSparkles(top: Container): Sprite[] {
  const dot = cachedTexture("dot", dotPixels);
  return Array.from({ length: SPARKLE_COUNT }, () => {
    const sparkle = new Sprite(dot);
    sparkle.anchor.set(0.5);
    sparkle.scale.set(3);
    top.addChild(sparkle);
    return sparkle;
  });
}

export function buildParty(layers: PartyLayers): PartyFx {
  const trim = new Graphics();
  layers.back.addChild(trim);
  const equalizer = buildEqualizer(layers.back);
  return new PartyFx({
    equalizer: equalizer.sprite,
    equalizerFrames: equalizer.frames,
    trim,
    speakerPulses: buildSpeakerPulses(layers.glow, layers.speakers),
    barGlow: buildBarGlow(layers.glow),
    sparkles: buildSparkles(layers.top),
    sparkleOrigin: { x: FLOOR_CENTER.x, y: FLOOR_CENTER.y + 90 },
  });
}
