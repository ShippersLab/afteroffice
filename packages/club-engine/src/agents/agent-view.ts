import { Container, Sprite, type Texture } from "pixi.js";
import {
  AGENT_H,
  type AgentPose,
  agentPixels,
  puddlePixels,
  shadowPixels,
} from "../sprites/agent-art";
import { bubblePixels, labelPixels } from "../sprites/label-art";
import { COLOR } from "../sprites/palette";
import { drawText } from "../sprites/pixel-font";
import { Pixels } from "../sprites/pixels";
import { cachedTexture, toTexture } from "../sprites/textures";
import type { AgentModel } from "../state/club-model";
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

export class AgentView {
  readonly body = new Container();
  readonly label = new Sprite();
  readonly bubble = new Sprite();
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

  constructor() {
    this.shadow.texture = cachedTexture("shadow", shadowPixels);
    this.puddle.texture = cachedTexture("puddle", puddlePixels);
    this.sleepMark.texture = cachedTexture("z", zPixels);
    for (const part of [this.shadow, this.puddle, this.figure]) {
      part.anchor.set(0.5, 1);
      part.scale.set(AGENT_SCALE);
    }
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
    this.body.addChild(this.puddle, this.shadow, this.figure, this.sleepMark);
    this.body.visible = false;
    this.label.visible = false;
    this.bubble.visible = false;
  }

  bind(agent: AgentModel): void {
    this.agentId = agent.id;
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
    this.labelHandle = "";
    this.body.visible = false;
    this.label.visible = false;
    this.clearBubble();
  }

  update(agent: AgentModel, timeMs: number, reducedMotion: boolean): void {
    this.syncLabel(agent);
    const feet = feetPosition(agent);
    const walking = agent.path.length > 0;
    const pose: AgentPose = walking || agent.leaving ? "stand" : poseForState(agent.state);
    const frame = !reducedMotion && pose === "dance" ? Math.floor(timeMs / 250) % 2 : 0;
    const breath =
      !reducedMotion && !walking && pose !== "dance" ? Math.floor(timeMs / 1000) % 2 : 0;
    const lift = walking ? hopOffset(agent) : seatOffset(agent.state, agent.vip) - breath;
    this.figure.texture = agentTexture(this.look, pose, frame);
    this.body.position.set(feet.x, feet.y);
    this.body.zIndex = depthFor(agent);
    this.figure.y = lift;
    this.body.alpha = agent.fade;
    this.puddle.visible = !walking && agent.state === "spilled-drink";
    this.updateSleepMark(pose, lift, timeMs, reducedMotion);
    this.updateOverlay(agent, feet.x, feet.y + lift);
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
    this.label.alpha = 0.9 * agent.fade;
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
  }
}
