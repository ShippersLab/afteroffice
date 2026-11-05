import { feetDepth, type Point, tileCenter } from "../mathematics/iso";
import type { AgentModel } from "../state/club-model";

export function feetPosition(agent: AgentModel): Point {
  const from = tileCenter(agent.tile.x, agent.tile.y);
  const next = agent.path[0];
  if (!next) {
    return from;
  }
  const to = tileCenter(next.x, next.y);
  return {
    x: Math.round(from.x + (to.x - from.x) * agent.progress),
    y: Math.round(from.y + (to.y - from.y) * agent.progress),
  };
}

export function depthFor(agent: AgentModel): number {
  const next = agent.path[0];
  if (!next) {
    return feetDepth(agent.tile.x, agent.tile.y);
  }
  const from = feetDepth(agent.tile.x, agent.tile.y);
  return from + (feetDepth(next.x, next.y) - from) * agent.progress;
}

export function hopOffset(agent: AgentModel): number {
  return agent.path.length > 0 ? -Math.round(Math.sin(agent.progress * Math.PI) * 4) : 0;
}
