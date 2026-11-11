import { hashString } from "../mathematics/rng";
import type { AgentModel, ClubModel } from "./club-model";
import { DOOR_TILE } from "./layout";

export type MomentKind = "cheer" | "pair" | "wave";

export type Moment = { readonly kind: MomentKind; ttl: number };

export const MOMENT_MS: Readonly<Record<MomentKind, number>> = {
  cheer: 1800,
  pair: 5000,
  wave: 2200,
};

export const SOCIAL_STEP_MS = 700;
export const SLOT_MS = 9000;
export const CALM_MS = 8000;
const PAIR_ODDS = 3;
const CHEER_ODDS = 2;
const CHEER_RADIUS = 3;
const CHEER_MIN = 3;
const GREET_RADIUS = 9;
const GREET_MAX = 2;

function reach(a: AgentModel, b: AgentModel): number {
  return Math.max(Math.abs(a.tile.x - b.tile.x), Math.abs(a.tile.y - b.tile.y));
}

function available(model: ClubModel, agent: AgentModel): boolean {
  return (
    agent.moment === null &&
    !agent.leaving &&
    agent.path.length === 0 &&
    agent.calmUntil <= model.time
  );
}

function sortedDancers(model: ClubModel): AgentModel[] {
  return [...model.agents.values()]
    .filter((agent) => agent.state === "dancing" && !agent.vip && available(model, agent))
    .toSorted((a, b) => (a.id < b.id ? -1 : 1));
}

function start(agent: AgentModel, kind: MomentKind): void {
  agent.moment = { kind, ttl: MOMENT_MS[kind] };
}

function pairUp(model: ClubModel): void {
  const slot = Math.floor(model.time / SLOT_MS);
  for (const agent of sortedDancers(model)) {
    if (agent.moment || hashString(`${agent.id}:${slot}`) % PAIR_ODDS !== 0) {
      continue;
    }
    const partner = sortedDancers(model).find(
      (other) => other.id !== agent.id && reach(agent, other) === 1,
    );
    if (partner) {
      start(agent, "pair");
      start(partner, "pair");
    }
  }
}

function cheer(model: ClubModel): void {
  const slot = Math.floor(model.time / SLOT_MS);
  if (slot === model.cheerSlot) {
    return;
  }
  model.cheerSlot = slot;
  const dancers = sortedDancers(model);
  if (dancers.length < CHEER_MIN || hashString(`cheer:${slot}`) % CHEER_ODDS !== 0) {
    return;
  }
  const seed = dancers[hashString(`seed:${slot}`) % dancers.length];
  if (!seed) {
    return;
  }
  const crowd = dancers.filter((agent) => reach(seed, agent) <= CHEER_RADIUS);
  if (crowd.length >= CHEER_MIN) {
    for (const agent of crowd) {
      start(agent, "cheer");
    }
  }
}

export function greetNewcomer(model: ClubModel, newcomerId: string): void {
  const greeters = [...model.agents.values()]
    .filter(
      (agent) =>
        agent.id !== newcomerId &&
        agent.state !== "asleep-on-the-sofa" &&
        available(model, agent) &&
        Math.max(Math.abs(agent.tile.x - DOOR_TILE.x), Math.abs(agent.tile.y - DOOR_TILE.y)) <=
          GREET_RADIUS,
    )
    .toSorted(
      (a, b) =>
        Math.hypot(a.tile.x - DOOR_TILE.x, a.tile.y - DOOR_TILE.y) -
          Math.hypot(b.tile.x - DOOR_TILE.x, b.tile.y - DOOR_TILE.y) || (a.id < b.id ? -1 : 1),
    )
    .slice(0, GREET_MAX);
  for (const agent of greeters) {
    start(agent, "wave");
  }
}

export function tickMoments(model: ClubModel, dt: number): void {
  for (const agent of model.agents.values()) {
    if (!agent.moment) {
      continue;
    }
    agent.moment.ttl -= dt;
    const moved = agent.path.length > 0 || agent.leaving;
    const lostDance = agent.moment.kind !== "wave" && agent.state !== "dancing";
    if (agent.moment.ttl <= 0 || moved || lostDance) {
      agent.moment = null;
      agent.calmUntil = model.time + CALM_MS;
    }
  }
}

export function tickSocial(model: ClubModel, dt: number): void {
  tickMoments(model, dt);
  model.socialIn -= dt;
  if (model.socialIn > 0) {
    return;
  }
  model.socialIn = SOCIAL_STEP_MS;
  cheer(model);
  pairUp(model);
}
