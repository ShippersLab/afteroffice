import type { LiveMessage, PublicAgent } from "@afteroffice/core";
import { describe, expect, it } from "vitest";
import { applyMessage, BUBBLE_MS, createModel, tickModel } from "../../state/club-model";
import { DOOR_TILE } from "../../state/layout";
import { ZONE_TILES } from "../../state/zones";

function agent(id: string, overrides: Partial<PublicAgent> = {}): PublicAgent {
  return {
    id,
    handle: "sleepy-otter-42",
    agent: "claude-code",
    state: "dancing",
    vip: false,
    ...overrides,
  };
}

const ID_A = "aaaaaaaaaaaa";
const ID_B = "bbbbbbbbbbbb";

function inZone(zone: keyof typeof ZONE_TILES, tile: { x: number; y: number }): boolean {
  return ZONE_TILES[zone].some((t) => t.x === tile.x && t.y === tile.y);
}

describe("club model", () => {
  it("places snapshot agents directly in their zones", () => {
    const model = createModel();
    const message: LiveMessage = {
      type: "snapshot",
      roomId: "floor-1",
      online: 2,
      agents: [agent(ID_A), agent(ID_B, { state: "at-the-bar" })],
    };
    applyMessage(model, message);
    expect(model.agents.size).toBe(2);
    expect(inZone("dance", model.agents.get(ID_A)?.tile ?? DOOR_TILE)).toBe(true);
    expect(inZone("bar", model.agents.get(ID_B)?.tile ?? DOOR_TILE)).toBe(true);
    expect(model.agents.get(ID_A)?.path).toEqual([]);
  });

  it("replaces everything on a new snapshot", () => {
    const model = createModel();
    applyMessage(model, { type: "agent-entered", agent: agent(ID_A) });
    applyMessage(model, { type: "snapshot", roomId: "floor-1", online: 1, agents: [agent(ID_B)] });
    expect([...model.agents.keys()]).toEqual([ID_B]);
  });

  it("spawns at the door and walks into the zone", () => {
    const model = createModel();
    applyMessage(model, { type: "agent-entered", agent: agent(ID_A) });
    const entered = model.agents.get(ID_A);
    expect(entered?.tile).toEqual(DOOR_TILE);
    expect(entered?.path.length).toBeGreaterThan(0);
    for (let i = 0; i < 200; i += 1) {
      tickModel(model, 100);
    }
    const settled = model.agents.get(ID_A);
    expect(settled && inZone("dance", settled.tile)).toBe(true);
  });

  it("retargets when the state changes zone", () => {
    const model = createModel();
    applyMessage(model, { type: "snapshot", roomId: "floor-1", online: 1, agents: [agent(ID_A)] });
    applyMessage(model, { type: "agent-changed", id: ID_A, state: "asleep-on-the-sofa" });
    expect(model.agents.get(ID_A)?.zone).toBe("sofa");
    expect(model.agents.get(ID_A)?.path.length).toBeGreaterThan(0);
  });

  it("walks leaving agents to the door and removes them after the fade", () => {
    const model = createModel();
    applyMessage(model, { type: "snapshot", roomId: "floor-1", online: 1, agents: [agent(ID_A)] });
    applyMessage(model, { type: "agent-left", id: ID_A });
    const removed: string[] = [];
    for (let i = 0; i < 300 && model.agents.size > 0; i += 1) {
      removed.push(...tickModel(model, 100));
    }
    expect(removed).toEqual([ID_A]);
    expect(model.agents.size).toBe(0);
  });

  it("shows a bubble for a few seconds and ignores online messages", () => {
    const model = createModel();
    applyMessage(model, { type: "snapshot", roomId: "floor-1", online: 1, agents: [agent(ID_A)] });
    applyMessage(model, { type: "bubble", id: ID_A, text: "<b>hi</b>" });
    expect(model.agents.get(ID_A)?.bubble?.text).toBe("<b>hi</b>");
    applyMessage(model, { type: "online", online: 9 });
    tickModel(model, BUBBLE_MS + 1);
    expect(model.agents.get(ID_A)?.bubble).toBeNull();
  });

  it("renames an agent in place", () => {
    const model = createModel();
    applyMessage(model, { type: "snapshot", roomId: "floor-1", online: 1, agents: [agent(ID_A)] });
    applyMessage(model, { type: "agent-renamed", id: ID_A, handle: "new-otter-42" });
    expect(model.agents.get(ID_A)?.handle).toBe("new-otter-42");
  });

  it("ignores renames for missing agents", () => {
    const model = createModel();
    applyMessage(model, { type: "agent-renamed", id: ID_B, handle: "new-otter-42" });
    expect(model.agents.size).toBe(0);
  });

  it("keeps VIP agents in the VIP corner and handles 80 agents", () => {
    const model = createModel();
    const agents = Array.from({ length: 80 }, (_, i) =>
      agent(`a${String(i).padStart(11, "0")}`, {
        vip: i < 12,
        state: i % 2 === 0 ? "dancing" : "at-the-bar",
      }),
    );
    applyMessage(model, { type: "snapshot", roomId: "floor-1", online: 80, agents });
    const vipAgents = [...model.agents.values()].filter((member) => member.vip);
    expect(vipAgents).toHaveLength(12);
    expect(vipAgents.every((member) => inZone("vip", member.tile))).toBe(true);
    for (let i = 0; i < 100; i += 1) {
      tickModel(model, 100);
    }
    expect(model.agents.size).toBe(80);
  });
});

describe("shown state", () => {
  it("shows what the agent is doing where it stands", () => {
    const model = createModel();
    const agents = Array.from({ length: 12 }, (_, index) =>
      agent(`sleeper${String(index).padStart(5, "0")}`, { state: "asleep-on-the-sofa" }),
    );
    applyMessage(model, { type: "snapshot", roomId: "floor-1", online: 12, agents });
    const shown = [...model.agents.values()].map((entry) => entry.shown);
    expect(shown.filter((state) => state === "asleep-on-the-sofa").length).toBeGreaterThan(0);
    expect(shown.filter((state) => state === "dancing").length).toBeGreaterThan(0);
    for (const entry of model.agents.values()) {
      const onSofa = inZone("sofa", entry.tile);
      expect(entry.shown === "asleep-on-the-sofa").toBe(onSofa);
    }
  });
});
