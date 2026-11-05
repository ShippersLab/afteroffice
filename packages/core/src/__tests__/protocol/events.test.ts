import { describe, expect, it } from "vitest";
import { ClubEventSchema, EnterResponseSchema, HandleSchema } from "../../protocol/events";

const SESSION_ID = "s_0123456789abcdef";

describe("ClubEventSchema", () => {
  it("accepts an enter event without a room", () => {
    const event = { type: "enter", sessionId: SESSION_ID, agent: "claude-code" };
    expect(ClubEventSchema.parse(event)).toEqual(event);
  });

  it("accepts a work event with a tool category", () => {
    const event = { type: "work", sessionId: SESSION_ID, roomId: "floor-3", tool: "bash" };
    expect(ClubEventSchema.parse(event)).toEqual(event);
  });

  it("rejects unknown fields so nothing private can ride along", () => {
    const event = {
      type: "work",
      sessionId: SESSION_ID,
      roomId: "floor-1",
      tool: "edit",
      path: "/Users/someone/secret.ts",
    };
    expect(ClubEventSchema.safeParse(event).success).toBe(false);
  });

  it("rejects events after enter that miss the room", () => {
    expect(ClubEventSchema.safeParse({ type: "idle", sessionId: SESSION_ID }).success).toBe(false);
  });

  it("rejects unknown event types and tool categories", () => {
    const base = { sessionId: SESSION_ID, roomId: "floor-1" };
    expect(ClubEventSchema.safeParse({ ...base, type: "dance" }).success).toBe(false);
    expect(ClubEventSchema.safeParse({ ...base, type: "work", tool: "deploy" }).success).toBe(
      false,
    );
  });

  it("rejects session ids that are too short or carry odd characters", () => {
    const event = { type: "enter", agent: "opencode" };
    expect(ClubEventSchema.safeParse({ ...event, sessionId: "short" }).success).toBe(false);
    expect(ClubEventSchema.safeParse({ ...event, sessionId: "../../etc/passwd0000" }).success).toBe(
      false,
    );
  });
});

describe("EnterResponseSchema", () => {
  it("carries the assigned floor and the vip flag", () => {
    expect(EnterResponseSchema.parse({ roomId: "floor-2", vip: true })).toEqual({
      roomId: "floor-2",
      vip: true,
    });
  });
});

describe("HandleSchema", () => {
  it("accepts generated handles", () => {
    expect(HandleSchema.safeParse("sleepy-otter-42").success).toBe(true);
  });

  it("rejects markup, spaces and uppercase", () => {
    for (const handle of ["<b>x</b>", "sleepy otter", "Sleepy-Otter", "-otter", "ab"]) {
      expect(HandleSchema.safeParse(handle).success).toBe(false);
    }
  });
});
