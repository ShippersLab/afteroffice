import type { LiveMessage, PublicAgent } from "@afteroffice/core";
import { describe, expect, it } from "vitest";
import { createMessageSink } from "../message-sink";
import { onlineCountOf, parseLiveMessage } from "../parse-message";

const online = (count: number): LiveMessage => ({ type: "online", online: count });
const agent: PublicAgent = {
  id: "abcdefghij12",
  handle: "sleepy-otter-42",
  agent: "claude-code",
  state: "at-the-bar",
  vip: false,
};
const snapshot = (count: number, agents: PublicAgent[] = []): LiveMessage => ({
  type: "snapshot",
  roomId: "floor-1",
  online: count,
  agents,
});

describe("parseLiveMessage", () => {
  it("accepts a valid message", () => {
    expect(parseLiveMessage(JSON.stringify(online(3)))).toEqual(online(3));
  });

  it("drops invalid json, unknown fields and non strings", () => {
    expect(parseLiveMessage("{nope")).toBeUndefined();
    expect(
      parseLiveMessage(JSON.stringify({ type: "online", online: 1, extra: 1 })),
    ).toBeUndefined();
    expect(parseLiveMessage(JSON.stringify({ type: "online", online: -1 }))).toBeUndefined();
    expect(parseLiveMessage(new ArrayBuffer(2))).toBeUndefined();
  });
});

describe("onlineCountOf", () => {
  it("reads snapshot and online messages", () => {
    expect(onlineCountOf(online(4))).toBe(4);
    expect(onlineCountOf(snapshot(9))).toBe(9);
    expect(onlineCountOf({ type: "agent-left", id: "abcdefghij12" })).toBeUndefined();
  });
});

describe("createMessageSink", () => {
  it("replays the tracked floor as one snapshot on attach", () => {
    const seen: LiveMessage[] = [];
    const sink = createMessageSink();
    sink.push(snapshot(1));
    sink.push({ type: "agent-entered", agent });
    sink.push({ type: "agent-changed", id: agent.id, state: "dancing" });
    sink.push(online(2));
    sink.attach({ apply: (message) => seen.push(message) });
    expect(seen).toEqual([snapshot(2, [{ ...agent, state: "dancing" }])]);
    sink.push(online(5));
    expect(seen.at(-1)).toEqual(online(5));
  });

  it("keeps tracking while detached so a later attach is current", () => {
    const seen: LiveMessage[] = [];
    const sink = createMessageSink();
    sink.push(snapshot(1, [agent]));
    sink.attach({ apply: () => undefined });
    sink.detach();
    sink.push({ type: "agent-left", id: agent.id });
    sink.push({ type: "bubble", id: agent.id, text: "one more deploy" });
    sink.attach({ apply: (message) => seen.push(message) });
    expect(seen).toEqual([snapshot(1, [])]);
  });

  it("ignores changes that arrive before any snapshot", () => {
    const seen: LiveMessage[] = [];
    const sink = createMessageSink();
    sink.push({ type: "agent-entered", agent });
    sink.attach({ apply: (message) => seen.push(message) });
    expect(seen).toEqual([]);
  });
});
