import { describe, expect, it } from "vitest";
import { applyMessage, createModel, tickModel } from "../../state/club-model";
import { greetNewcomer, MOMENT_MS } from "../../state/social";

const base = { agent: "claude-code", vip: false } as const;

function seed(ids: string[], state: "dancing" | "at-the-bar" = "dancing") {
  const model = createModel();
  applyMessage(model, {
    type: "snapshot",
    roomId: "floor-1",
    online: ids.length,
    agents: ids.map((id) => ({ ...base, id, handle: `agent-${id}`, state })),
  });
  return model;
}

describe("social moments", () => {
  it("waves at a newcomer from agents near the door", () => {
    const model = seed(["aaaaaaaaaaaa", "bbbbbbbbbbbb"], "at-the-bar");
    for (const agent of model.agents.values()) {
      agent.tile = { x: 1, y: 14 };
    }
    applyMessage(model, {
      type: "agent-entered",
      agent: { ...base, id: "cccccccccccc", handle: "new-one-1", state: "dancing" },
    });
    const waving = [...model.agents.values()].filter((agent) => agent.moment?.kind === "wave");
    expect(waving.length).toBeGreaterThan(0);
    expect(waving.length).toBeLessThanOrEqual(2);
  });

  it("never greets sleepers", () => {
    const model = seed(["aaaaaaaaaaaa"]);
    const only = model.agents.get("aaaaaaaaaaaa");
    if (only) {
      only.state = "asleep-on-the-sofa";
      only.tile = { x: 1, y: 14 };
    }
    greetNewcomer(model, "zzzzzzzzzzzz");
    expect(only?.moment).toBeNull();
  });

  it("expires moments and rests before the next one", () => {
    const model = seed(["aaaaaaaaaaaa"]);
    const agent = model.agents.get("aaaaaaaaaaaa");
    if (agent) {
      agent.moment = { kind: "cheer", ttl: MOMENT_MS.cheer };
    }
    tickModel(model, MOMENT_MS.cheer + 10);
    expect(agent?.moment).toBeNull();
    expect(agent?.calmUntil).toBeGreaterThan(model.time);
  });

  it("is deterministic for the same ids", () => {
    const ids = ["aaaaaaaaaaaa", "bbbbbbbbbbbb", "cccccccccccc", "dddddddddddd"];
    const run = (): string[] => {
      const model = seed(ids);
      for (let i = 0; i < 40; i += 1) {
        tickModel(model, 700);
      }
      return [...model.agents.values()].map((agent) => agent.moment?.kind ?? "none");
    };
    expect(run()).toEqual(run());
  });
});
