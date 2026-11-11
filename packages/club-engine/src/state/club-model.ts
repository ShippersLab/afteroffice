import type { AgentState, LiveMessage, PublicAgent } from "@afteroffice/core";
import { type Tile, tileKey } from "../mathematics/iso";
import { findPath } from "../mathematics/pathing";
import { createRng, hashString, type Rng } from "../mathematics/rng";
import { DOOR_TILE } from "./layout";
import { rulesFor } from "./path-rules";
import { greetNewcomer, type Moment, tickSocial } from "./social";
import { canWander, pickTile, type ZoneId, zoneForState } from "./zones";

export const STEP_MS = 320;
export const BUBBLE_MS = 4000;
export const FADE_MS = 600;
export const WANDER_MIN_MS = 3000;
export const WANDER_MAX_MS = 8000;

export type Bubble = { readonly text: string; ttl: number };

export type AgentModel = {
  readonly id: string;
  handle: string;
  readonly vip: boolean;
  readonly rng: Rng;
  state: AgentState;
  zone: ZoneId;
  tile: Tile;
  path: Tile[];
  progress: number;
  wanderIn: number;
  bubble: Bubble | null;
  moment: Moment | null;
  calmUntil: number;
  leaving: boolean;
  fade: number;
};

export type ClubModel = {
  readonly agents: Map<string, AgentModel>;
  time: number;
  socialIn: number;
  cheerSlot: number;
};

export function createModel(): ClubModel {
  return { agents: new Map(), time: 0, socialIn: 0, cheerSlot: -1 };
}

export function takenTiles(model: ClubModel, exceptId: string): Set<string> {
  const taken = new Set<string>();
  for (const agent of model.agents.values()) {
    if (agent.id !== exceptId && !agent.leaving) {
      taken.add(tileKey(agent.path[agent.path.length - 1] ?? agent.tile));
    }
  }
  return taken;
}

function createAgent(source: PublicAgent, tile: Tile): AgentModel {
  const rng = createRng(hashString(source.id));
  return {
    id: source.id,
    handle: source.handle,
    vip: source.vip,
    rng,
    state: source.state,
    zone: zoneForState(source.state, source.vip),
    tile,
    path: [],
    progress: 0,
    wanderIn: rng.range(WANDER_MIN_MS, WANDER_MAX_MS),
    bubble: null,
    moment: null,
    calmUntil: 0,
    leaving: false,
    fade: 1,
  };
}

function walkTo(agent: AgentModel, target: Tile): void {
  const start = agent.path[0] ?? agent.tile;
  const route = findPath(start, target, rulesFor(agent.vip));
  if (!route) {
    agent.tile = target;
    agent.path = [];
    agent.progress = 0;
    return;
  }
  const midStep = agent.path.length > 0;
  agent.path = midStep ? [start, ...route] : route;
  if (!midStep) {
    agent.progress = 0;
  }
}

function placeAgent(model: ClubModel, source: PublicAgent, atDoor: boolean): void {
  const zone = zoneForState(source.state, source.vip);
  const draft = createAgent(source, DOOR_TILE);
  const target = pickTile(zone, takenTiles(model, source.id), draft.rng);
  model.agents.set(source.id, draft);
  if (atDoor) {
    walkTo(draft, target);
  } else {
    draft.tile = target;
  }
}

export function applyMessage(model: ClubModel, message: LiveMessage): void {
  switch (message.type) {
    case "snapshot": {
      model.agents.clear();
      for (const source of message.agents) {
        placeAgent(model, source, false);
      }
      return;
    }
    case "agent-entered": {
      model.agents.delete(message.agent.id);
      placeAgent(model, message.agent, true);
      greetNewcomer(model, message.agent.id);
      return;
    }
    case "agent-changed": {
      const agent = model.agents.get(message.id);
      if (!agent) {
        return;
      }
      agent.state = message.state;
      const zone = zoneForState(message.state, agent.vip);
      if (zone !== agent.zone) {
        agent.zone = zone;
        walkTo(agent, pickTile(zone, takenTiles(model, agent.id), agent.rng));
      }
      return;
    }
    case "agent-left": {
      const agent = model.agents.get(message.id);
      if (agent && !agent.leaving) {
        agent.leaving = true;
        walkTo(agent, DOOR_TILE);
      }
      return;
    }
    case "agent-renamed": {
      const agent = model.agents.get(message.id);
      if (agent) {
        agent.handle = message.handle;
      }
      return;
    }
    case "bubble": {
      const agent = model.agents.get(message.id);
      if (agent) {
        agent.bubble = { text: message.text, ttl: BUBBLE_MS };
      }
      return;
    }
    case "online":
      return;
    default: {
      const unhandled: never = message;
      throw new Error(`Unhandled live message: ${JSON.stringify(unhandled)}`);
    }
  }
}

function advance(agent: AgentModel, dt: number): void {
  agent.progress += dt / STEP_MS;
  while (agent.progress >= 1 && agent.path.length > 0) {
    const next = agent.path.shift();
    if (next) {
      agent.tile = next;
    }
    agent.progress -= 1;
  }
  if (agent.path.length === 0) {
    agent.progress = 0;
  }
}

function maybeWander(model: ClubModel, agent: AgentModel, dt: number): void {
  agent.wanderIn -= dt;
  if (agent.wanderIn > 0) {
    return;
  }
  agent.wanderIn = agent.rng.range(WANDER_MIN_MS, WANDER_MAX_MS);
  if (agent.leaving || agent.moment || agent.path.length > 0 || !canWander(agent.zone)) {
    return;
  }
  walkTo(agent, pickTile(agent.zone, takenTiles(model, agent.id), agent.rng));
}

export function tickModel(model: ClubModel, dt: number): string[] {
  const removed: string[] = [];
  model.time += dt;
  tickSocial(model, dt);
  for (const agent of model.agents.values()) {
    if (agent.bubble) {
      agent.bubble.ttl -= dt;
      if (agent.bubble.ttl <= 0) {
        agent.bubble = null;
      }
    }
    if (agent.path.length > 0) {
      advance(agent, dt);
    } else if (agent.leaving) {
      agent.fade -= dt / FADE_MS;
      if (agent.fade <= 0) {
        removed.push(agent.id);
      }
    } else {
      maybeWander(model, agent, dt);
    }
  }
  for (const id of removed) {
    model.agents.delete(id);
  }
  return removed;
}
