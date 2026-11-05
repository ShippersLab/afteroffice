import { AGENT_STATES } from "@afteroffice/core";
import { describe, expect, it } from "vitest";
import { createRng } from "../../mathematics/rng";
import { isWalkable } from "../../state/layout";
import { canWander, pickTile, ZONE_TILES, zoneForState } from "../../state/zones";

describe("zones", () => {
  it("maps every state to a zone", () => {
    expect(AGENT_STATES.map((state) => zoneForState(state, false))).toEqual([
      "dance",
      "dj",
      "bar",
      "sofa",
      "door",
      "spill",
    ]);
  });

  it("keeps VIP agents in the VIP zone", () => {
    for (const state of AGENT_STATES) {
      expect(zoneForState(state, true)).toBe("vip");
    }
  });

  it("has walkable tiles and VIP capacity of 12", () => {
    for (const tiles of Object.values(ZONE_TILES)) {
      expect(tiles.length).toBeGreaterThan(0);
      expect(tiles.every(isWalkable)).toBe(true);
    }
    expect(ZONE_TILES.vip).toHaveLength(12);
  });

  it("picks free tiles and falls back when a zone is full", () => {
    const rng = createRng(7);
    const taken = new Set(ZONE_TILES.dj.map((tile) => `${tile.x},${tile.y}`));
    const tile = pickTile("dj", taken, rng);
    expect(taken.has(`${tile.x},${tile.y}`)).toBe(false);
    expect(canWander("dance")).toBe(true);
    expect(canWander("dj")).toBe(false);
  });
});
