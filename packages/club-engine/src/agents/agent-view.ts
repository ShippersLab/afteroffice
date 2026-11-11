import { Container, type FederatedPointerEvent, Rectangle, Sprite, type Texture } from "pixi.js";
import { hashString } from "../mathematics/rng";
import {
  AGENT_H,
  type AgentPose,
  agentPixels,
  puddlePixels,
  shadowPixels,
} from "../sprites/agent-art";
import { bubblePixels, labelPixels } from "../sprites/label-art";
import { momentPixels, ringPixels } from "../sprites/moment-art";
import { COLOR } from "../sprites/palette";
import { drawText } from "../sprites/pixel-font";
import { Pixels } from "../sprites/pixels";
import { cachedTexture, toTexture } from "../sprites/textures";
import type { AgentModel } from "../state/club-model";
import type { MomentKind } from "../state/social";
import { type Appearance, appearanceFor, poseForState, seatOffset } from "./agent-appearance";
import { depthFor, feetPosition, hopOffset } from "./movement";

export const AGENT_SCALE = 3;
const HEAD_ROOM = AGENT_H * AGENT_SCALE;

function agentTexture(look: Appearance, pose: AgentPose, frame: number): Texture {
  return cachedTexture(`agent-${look.body}-${look.accessory}-${pose}-${frame}`, () =>
    agentPixels(look.body, look.accessory, pose, frame),
  );
}

function zPixels(): Pixels {
  const pixels = new Pixels(3, 5);
  drawText(pixels, "Z", 0, 0, COLOR.lilac);
  return pixels;
}

const TAP_SLOP_PX = 12;
const HIT_AREA = new Rectangle(-15, -26, 30, 32);
const MOMENT_FADE_MS = 400;
const RING_FADE_MS = 180;
const RING_HOVER = 0x2ce6ff;
const RING_SELECTED = 0xff3da6;

export type AgentViewHandlers = {
  readonly hover: (id: string, over: boolean) => void;
  readonly select: (id: string) => void;
};

function momentHop(kind: MomentKind, timeMs: number, parity: number): number {
  switch (kind) {
    case "cheer":
      return Math.floor(timeMs / 300) % 2 === 0 ? 0 : 4;
    case "pair":
      return (Math.floor(timeMs / 540) + parity) % 2 === 0 ? 0 : 3;
    case "wave":
      return Math.floor(timeMs / 360) % 2 === 0 ? 0 : 2;
    default: {
      const unhandled: never = kind;
      throw new Error(`Unhandled moment: ${String(unhandled)}`);
    }
  }
}

export class AgentView {
  readonly body = new Container();
  readonly label = new Sprite();
  readonly bubble = new Sprite();
  readonly badge = new Sprite();
  hovered = false;
  selected = false;
  private readonly ring = new Sprite();
  private ringLevel = 0;
  private lastTime = 0;
  private parity = 0;
  private badgeKind: MomentKind | null = null;
  private pressed: { x: number; y: number } | null = null;
  private readonly shadow = new Sprite();
  private readonly puddle = new Sprite();
  private readonly figure = new Sprite();
  private readonly sleepMark = new Sprite();
  private labelTexture: Texture | null = null;
  private labelHandle = "";
  private bubbleTexture: Texture | null = null;
  private bubbleText = "";
  private look: Appearance = { body: 0, accessory: "none" };
  agentId = "";

  constructor(handlers: AgentViewHandlers) {
    this.shadow.texture = cachedTexture("shadow", shadowPixels);
    this.puddle.texture = cachedTexture("puddle", puddlePixels);
    this.sleepMark.texture = cachedTexture("z", zPixels);
    for (const part of [this.shadow, this.puddle, this.figure]) {
      part.anchor.set(0.5, 1);
      part.scale.set(AGENT_SCALE);
    }
    this.ring.texture = cachedTexture("ring", ringPixels);
    this.ring.anchor.set(0.5, 0.6);
    this.ring.scale.set(3);
    this.ring.visible = false;
    this.badge.anchor.set(0.5, 1);
    this.badge.visible = false;
    this.shadow.anchor.set(0.5, 0.6);
    this.shadow.alpha = 0.4;
    this.puddle.anchor.set(0.5, 0.6);
    this.sleepMark.scale.set(AGENT_SCALE);
    this.sleepMark.anchor.set(0.5, 1);
    this.label.anchor.set(0.5, 1);
    this.label.scale.set(2);
    this.label.alpha = 0.9;
    this.bubble.anchor.set(0.5, 1);
    this.bubble.scale.set(2);
    this.body.addChild(this.ring, this.puddle, this.shadow, this.figure, this.sleepMark);
    this.figure.eventMode = "static";
    this.figure.cursor = "pointer";
    this.figure.hitArea = HIT_AREA;
    this.figure.on("pointerover", (event: FederatedPointerEvent) => {
      if (event.pointerType === "mouse") {
        handlers.hover(this.agentId, true);
      }
    });
    this.figure.on("pointerout", (event: FederatedPointerEvent) => {
      if (event.pointerType === "mouse") {
        handlers.hover(this.agentId, false);
      }
    });
    this.figure.on("pointerdown", (event: FederatedPointerEvent) => {
      this.pressed = { x: event.global.x, y: event.global.y };
    });
    this.figure.on("pointertap", (event: FederatedPointerEvent) => {
      const start = this.pressed;
      this.pressed = null;
      if (start && Math.hypot(event.global.x - start.x, event.global.y - start.y) > TAP_SLOP_PX) {
        return;
      }
      handlers.select(this.agentId);
    });
    this.body.visible = false;
    this.label.visible = false;
    this.bubble.visible = false;
  }

  bind(agent: AgentModel): void {
    this.agentId = agent.id;
    this.parity = hashString(agent.id) & 1;
    this.hovered = false;
    this.selected = false;
    this.look = appearanceFor(agent.id);
    this.labelHandle = "";
    this.syncLabel(agent);
    this.clearBubble();
    this.body.visible = true;
    this.label.visible = true;
  }

  private syncLabel(agent: AgentModel): void {
    if (agent.handle === this.labelHandle) {
      return;
    }
    this.labelHandle = agent.handle;
    this.labelTexture?.destroy(true);
    this.labelTexture = toTexture(labelPixels(agent.handle, agent.vip));
    this.label.texture = this.labelTexture;
  }

  release(): void {
    this.agentId = "";
    this.hovered = false;
    this.selected = false;
    this.ring.visible = false;
    this.ringLevel = 0;
    this.badge.visible = false;
    this.badgeKind = null;
    this.labelHandle = "";
    this.body.visible = false;
    this.label.visible = false;
    this.clearBubble();
  }

  update(agent: AgentModel, timeMs: number, reducedMotion: boolean): void {
    this.syncLabel(agent);
    const feet = feetPosition(agent);
    const walking = agent.path.length > 0;
    const pose: AgentPose = walking || agent.leaving ? "stand" : poseForState(agent.shown);
    const frame = !reducedMotion && pose === "dance" ? Math.floor(timeMs / 250) % 2 : 0;
    const breath =
      !reducedMotion && !walking && pose !== "dance" ? Math.floor(timeMs / 1000) % 2 : 0;
    const moment = walking ? null : agent.moment;
    const hop = moment && !reducedMotion ? momentHop(moment.kind, timeMs, this.parity) : 0;
    const lift = walking ? hopOffset(agent) : seatOffset(agent.shown, agent.vip) - breath - hop;
    this.figure.texture = agentTexture(this.look, pose, frame);
    this.body.position.set(feet.x, feet.y);
    this.body.zIndex = depthFor(agent);
    this.figure.y = lift;
    this.body.alpha = agent.fade;
    this.puddle.visible = !walking && agent.shown === "spilled-drink";
    this.updateRing(timeMs, reducedMotion);
    this.updateSleepMark(pose, lift, timeMs, reducedMotion);
    this.updateOverlay(agent, feet.x, feet.y + lift);
    this.updateBadge(moment, feet.x, feet.y + lift, timeMs, reducedMotion);
  }

  private updateRing(timeMs: number, reducedMotion: boolean): void {
    const dt = Math.max(0, Math.min(100, timeMs - this.lastTime));
    this.lastTime = timeMs;
    const target = this.selected || this.hovered ? 1 : 0;
    const step = reducedMotion ? 1 : dt / RING_FADE_MS;
    this.ringLevel =
      target > this.ringLevel
        ? Math.min(target, this.ringLevel + step)
        : Math.max(target, this.ringLevel - step);
    this.ring.visible = this.ringLevel > 0;
    this.ring.alpha = this.ringLevel;
    this.ring.scale.set(3 * (0.7 + 0.3 * this.ringLevel));
    this.ring.tint = this.selected ? RING_SELECTED : RING_HOVER;
  }

  private updateBadge(
    moment: AgentModel["moment"],
    x: number,
    feetY: number,
    timeMs: number,
    reducedMotion: boolean,
  ): void {
    if (!moment || this.bubble.visible) {
      this.badge.visible = false;
      return;
    }
    if (moment.kind !== this.badgeKind) {
      this.badgeKind = moment.kind;
      this.badge.texture = cachedTexture(`moment-${moment.kind}`, () => momentPixels(moment.kind));
      this.badge.scale.set(moment.kind === "wave" ? 2 : 3);
    }
    const bob = reducedMotion ? 0 : (Math.floor(timeMs / 400) % 2) * 3;
    this.badge.visible = true;
    this.badge.alpha = reducedMotion ? 1 : Math.min(1, moment.ttl / MOMENT_FADE_MS);
    this.badge.position.set(x, feetY - HEAD_ROOM - 24 - bob);
  }

  private updateSleepMark(
    pose: AgentPose,
    lift: number,
    timeMs: number,
    reducedMotion: boolean,
  ): void {
    this.sleepMark.visible = pose === "sleep";
    if (!this.sleepMark.visible) {
      return;
    }
    const cycle = reducedMotion ? 0.3 : (timeMs % 2400) / 2400;
    this.sleepMark.position.set(
      HEAD_ROOM / 4 + 6,
      lift - HEAD_ROOM + 6 - Math.round(cycle * 4) * 3,
    );
    this.sleepMark.alpha = 1 - cycle;
  }

  private updateOverlay(agent: AgentModel, x: number, feetY: number): void {
    const top = feetY - HEAD_ROOM;
    this.label.position.set(x, top - 2);
    this.label.alpha = (this.hovered || this.selected ? 1 : 0.9) * agent.fade;
    this.syncBubble(agent);
    this.bubble.position.set(x, top - 24);
  }

  private syncBubble(agent: AgentModel): void {
    const text = agent.bubble?.text ?? "";
    if (text === this.bubbleText) {
      return;
    }
    this.clearBubble();
    if (text.length === 0) {
      return;
    }
    this.bubbleText = text;
    this.bubbleTexture = toTexture(bubblePixels(text));
    this.bubble.texture = this.bubbleTexture;
    this.bubble.visible = true;
  }

  private clearBubble(): void {
    this.bubbleText = "";
    this.bubble.visible = false;
    this.bubbleTexture?.destroy(true);
    this.bubbleTexture = null;
  }

  destroy(): void {
    this.clearBubble();
    this.labelTexture?.destroy(true);
    this.labelTexture = null;
    this.body.destroy({ children: true });
    this.label.destroy();
    this.bubble.destroy();
    this.badge.destroy();
  }
}
