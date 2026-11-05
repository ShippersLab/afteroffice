import type { AgentState } from "@afteroffice/core";
import { hashString } from "../mathematics/rng";
import { ACCESSORIES, type Accessory, type AgentPose, BODIES } from "../sprites/agent-art";

export type Appearance = { readonly body: number; readonly accessory: Accessory };

export function appearanceFor(id: string): Appearance {
  const hash = hashString(id);
  return {
    body: hash % BODIES.length,
    accessory: ACCESSORIES[(hash >>> 4) % ACCESSORIES.length] ?? "none",
  };
}

export function poseForState(state: AgentState): AgentPose {
  switch (state) {
    case "dancing":
      return "dance";
    case "dj-booth":
      return "dj";
    case "at-the-bar":
      return "bar";
    case "asleep-on-the-sofa":
      return "sleep";
    case "stuck-at-the-door":
      return "door";
    case "spilled-drink":
      return "spill";
    default: {
      const unhandled: never = state;
      throw new Error(`Unhandled agent state: ${String(unhandled)}`);
    }
  }
}

export function seatOffset(state: AgentState, vip: boolean): number {
  if (vip) {
    return 0;
  }
  if (state === "at-the-bar") {
    return -8;
  }
  if (state === "asleep-on-the-sofa") {
    return -6;
  }
  return 0;
}
