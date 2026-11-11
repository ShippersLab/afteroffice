import type { Graphics, Sprite, Texture } from "pixi.js";
import { hashString } from "../mathematics/rng";
import { COLOR } from "../sprites/palette";
import { WALL_H, WALL_SPAN } from "./floor-art";
import { EQ_FRAMES } from "./party-art";

export const BEAT_MS = 540;
const EQ_STEP_MS = 340;
const TRIM_STEP_MS = 700;
const TRIM_COLORS = [COLOR.magenta, COLOR.ultraviolet, COLOR.cyan] as const;
const SPARKLE_COLORS = [COLOR.magenta, COLOR.cyan, COLOR.amber, COLOR.lilac] as const;
const SPARKLE_RISE = 240;

export type PartyParts = {
  readonly equalizer: Sprite;
  readonly equalizerFrames: readonly Texture[];
  readonly trim: Graphics;
  readonly speakerPulses: readonly Sprite[];
  readonly barGlow: readonly Sprite[];
  readonly sparkles: readonly Sprite[];
  readonly sparkleOrigin: { readonly x: number; readonly y: number };
};

export class PartyFx {
  private readonly parts: PartyParts;
  private trimStep = -1;
  private eqStep = -1;

  constructor(parts: PartyParts) {
    this.parts = parts;
    parts.sparkles.forEach((sprite, index) => {
      sprite.tint = SPARKLE_COLORS[index % SPARKLE_COLORS.length] ?? COLOR.lilac;
    });
    this.update(0, true);
  }

  update(timeMs: number, reducedMotion: boolean): void {
    const t = reducedMotion ? 0 : timeMs;
    this.updateEqualizer(t, reducedMotion);
    this.updateTrim(t);
    this.updateSpeakers(t, reducedMotion);
    this.updateBarGlow(t);
    this.updateSparkles(t, reducedMotion);
  }

  private updateEqualizer(t: number, reducedMotion: boolean): void {
    const step = Math.floor(t / EQ_STEP_MS);
    if (step === this.eqStep) {
      return;
    }
    this.eqStep = step;
    const frames = this.parts.equalizerFrames;
    const frame = reducedMotion ? 2 : step % EQ_FRAMES;
    this.parts.equalizer.texture = frames[frame] ?? frames[0] ?? this.parts.equalizer.texture;
  }

  private updateTrim(t: number): void {
    const step = Math.floor(t / TRIM_STEP_MS);
    if (step === this.trimStep) {
      return;
    }
    this.trimStep = step;
    const trim = this.parts.trim;
    trim.clear();
    const segments = WALL_SPAN / 40;
    for (let i = 0; i < segments; i += 1) {
      const color = TRIM_COLORS[(i + step) % TRIM_COLORS.length] ?? COLOR.magenta;
      const y = -WALL_H + 5 + i * 20;
      trim.poly([i * 40, y, i * 40 + 40, y + 20, i * 40 + 40, y + 23, i * 40, y + 3]).fill(color);
      const lx = -i * 40;
      trim.poly([lx, y, lx - 40, y + 20, lx - 40, y + 23, lx, y + 3]).fill(color);
    }
  }

  private updateSpeakers(t: number, reducedMotion: boolean): void {
    const beatPhase = (t % BEAT_MS) / BEAT_MS;
    const pulse = reducedMotion ? 0.2 : Math.round((1 - beatPhase) ** 2 * 6) / 6;
    for (const sprite of this.parts.speakerPulses) {
      sprite.alpha = 0.15 + pulse * 0.55;
    }
  }

  private updateBarGlow(t: number): void {
    const wave = 0.5 + 0.5 * Math.sin(t / 1800);
    const alpha = Math.round((0.06 + 0.06 * wave) * 50) / 50;
    for (const sprite of this.parts.barGlow) {
      sprite.alpha = alpha;
    }
  }

  private updateSparkles(t: number, reducedMotion: boolean): void {
    const origin = this.parts.sparkleOrigin;
    this.parts.sparkles.forEach((sprite, index) => {
      const seed = hashString(`sparkle-${index}`);
      const speed = 0.012 + (seed % 7) * 0.002;
      const travel = reducedMotion
        ? seed % 200
        : (t * speed + (seed % SPARKLE_RISE)) % SPARKLE_RISE;
      const sway = reducedMotion ? 0 : Math.sin(t / 900 + (seed % 13)) * 6;
      const spread = ((seed >>> 8) % 560) - 280;
      sprite.x = Math.round(origin.x + spread + sway);
      sprite.y = Math.round(origin.y - travel);
      const fade = 1 - Math.abs(travel / SPARKLE_RISE - 0.5) * 2;
      sprite.alpha = Math.round(Math.max(0, fade) * 0.9 * 4) / 4;
    });
  }
}
