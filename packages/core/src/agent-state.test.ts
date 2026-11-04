import { describe, expect, it } from "vitest";
import { nextAgentState, stateForTool } from "./agent-state";
import { type ClubEvent, TOOL_CATEGORIES } from "./events";

const inRoom = { sessionId: "s_0123456789abcdef", roomId: "floor-1" } as const;

describe("nextAgentState", () => {
  it("walks a new agent to the bar", () => {
    const event: ClubEvent = { type: "enter", sessionId: inRoom.sessionId, agent: "claude-code" };
    expect(nextAgentState(null, event)).toBe("at-the-bar");
  });

  it.each([
    [{ type: "waiting", ...inRoom }, "stuck-at-the-door"],
    [{ type: "done", ...inRoom }, "at-the-bar"],
    [{ type: "idle", ...inRoom }, "asleep-on-the-sofa"],
    [{ type: "error", ...inRoom }, "spilled-drink"],
    [{ type: "work", ...inRoom, tool: "edit" }, "dancing"],
    [{ type: "work", ...inRoom, tool: "bash" }, "dj-booth"],
  ] satisfies [ClubEvent, string][])("maps %o to %s", (event, expected) => {
    expect(nextAgentState("dancing", event)).toBe(expected);
  });

  it("removes the agent on leave", () => {
    expect(nextAgentState("dancing", { type: "leave", ...inRoom })).toBeNull();
  });

  it("keeps the current state on heartbeat", () => {
    expect(nextAgentState("dj-booth", { type: "heartbeat", ...inRoom })).toBe("dj-booth");
    expect(nextAgentState(null, { type: "heartbeat", ...inRoom })).toBeNull();
  });
});

describe("stateForTool", () => {
  it("sends shell work to the dj booth and everything else to the dance floor", () => {
    for (const tool of TOOL_CATEGORIES) {
      expect(stateForTool(tool)).toBe(tool === "bash" ? "dj-booth" : "dancing");
    }
  });
});
