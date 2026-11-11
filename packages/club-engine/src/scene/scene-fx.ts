import type { Graphics, Sprite, Texture } from "pixi.js";
import { TILE_H } from "../mathematics/iso";
import { COLOR } from "../sprites/palette";
import { GRID_SIZE } from "../state/layout";

const FLOOR_Y = ((GRID_SIZE - 1) * TILE_H) / 2;
const SPOT_X = 260;
const SPOT_Y = 120;
const BEAM_X = 340;
const BEAM_Y = 180;

export const FLOOR_CENTER = { x: 0, y: FLOOR_Y };
export const BALL_POSITION = { x: 0, y: FLOOR_Y - 180 };

export type GlowTile = { readonly sprite: Sprite; readonly parity: number };

export type FxParts = {
  readonly glowTiles: readonly GlowTile[];
  readonly spots: readonly Sprite[];
  readonly beams: Graphics;
  readonly ball: Sprite;
  readonly ballFrames: readonly [Texture, Texture];
};

const BEAM_MS = 7000;
const BEAM_COUNT = 4;

export class SceneFx {
  private readonly parts: FxParts;
  private beamFrame = -1;

  constructor(parts: FxParts) {
    this.parts = parts;
    this.update(0, true);
  }

  update(timeMs: number, reducedMotion: boolean): void {
    const t = reducedMotion ? 0 : timeMs;
    this.updateGlow(t, reducedMotion);
    this.updateSpots(t);
    this.updateBeams(t);
    const frame = reducedMotion ? 0 : Math.floor(t / 700) % 2;
    this.parts.ball.texture = this.parts.ballFrames[frame] ?? this.parts.ballFrames[0];
  }

  private updateGlow(t: number, reducedMotion: boolean): void {
    for (const tile of this.parts.glowTiles) {
      const wave = reducedMotion ? 0.5 : 0.5 + 0.5 * Math.sin(t / 900 + tile.parity * Math.PI);
      tile.sprite.alpha = Math.round((0.12 + 0.3 * wave) * 20) / 20;
    }
  }

  private updateSpots(t: number): void {
    this.parts.spots.forEach((spot, index) => {
      const phase = index * 2.1;
      spot.x = FLOOR_CENTER.x + Math.sin(t / 2300 + phase) * SPOT_X;
      spot.y = FLOOR_CENTER.y + Math.sin(t / 1700 + phase * 1.7) * SPOT_Y;
    });
  }

  private updateBeams(t: number): void {
    const step = Math.floor(t / 120);
    if (step === this.beamFrame) {
      return;
    }
    this.beamFrame = step;
    const beams = this.parts.beams;
    beams.clear();
    const sweep = (t / BEAM_MS) * Math.PI * 2;
    for (let i = 0; i < BEAM_COUNT; i += 1) {
      const angle = sweep + (i * Math.PI * 2) / BEAM_COUNT;
      const a = this.floorPoint(angle);
      const b = this.floorPoint(angle + 0.32);
      const style = { color: i % 2 === 0 ? COLOR.magenta : COLOR.cyan, alpha: 0.1 };
      beams.poly([BALL_POSITION.x, BALL_POSITION.y, a.x, a.y, b.x, b.y]);
      beams.setFillStyle(style);
      beams.fill();
    }
  }

  private floorPoint(angle: number): { x: number; y: number } {
    return {
      x: Math.round(FLOOR_CENTER.x + Math.cos(angle) * BEAM_X),
      y: Math.round(FLOOR_CENTER.y + Math.sin(angle) * BEAM_Y),
    };
  }
}
