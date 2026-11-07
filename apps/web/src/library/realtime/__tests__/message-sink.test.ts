import type { LiveMessage, PublicAgent } from "@afteroffice/core";
import { describe, expect, it } from "vitest";
import { createMessageSink } from "../message-sink";

const agent: PublicAgent = {
  id: "abcdefghij12",
  handle: "sleepy-otter-42",
  agent: "claude-code",
  state: "at-the-bar",
  vip: false,
};

describe("createMessageSink", () => {
  it("replays renamed handles in the tracked snapshot", () => {
    const seen: LiveMessage[] = [];
    const sink = createMessageSink();
    sink.push({ type: "snapshot", roomId: "floor-1", online: 1, agents: [agent] });
    sink.push({ type: "agent-renamed", id: agent.id, handle: "new-otter-42" });
    sink.attach({ apply: (message) => seen.push(message) });
    expect(seen).toEqual([
      {
        type: "snapshot",
        roomId: "floor-1",
        online: 1,
        agents: [{ ...agent, handle: "new-otter-42" }],
      },
    ]);
  });

  it("ignores renames for unknown agents", () => {
    const seen: LiveMessage[] = [];
    const sink = createMessageSink();
    sink.push({ type: "snapshot", roomId: "floor-1", online: 1, agents: [] });
    sink.push({ type: "agent-renamed", id: agent.id, handle: "new-otter-42" });
    sink.attach({ apply: (message) => seen.push(message) });
    expect(seen).toEqual([{ type: "snapshot", roomId: "floor-1", online: 1, agents: [] }]);
  });
});
