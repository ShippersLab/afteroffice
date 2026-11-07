import { describe, expect, it } from "vitest";
import { LiveMessageSchema } from "../../protocol/live";

const AGENT_ID = "0123456789ab";

describe("LiveMessageSchema", () => {
  it("accepts an agent renamed message with a valid handle", () => {
    const message = { type: "agent-renamed", id: AGENT_ID, handle: "sleepy-otter-42" };
    expect(LiveMessageSchema.parse(message)).toEqual(message);
  });

  it("rejects an agent renamed message with an invalid handle", () => {
    expect(
      LiveMessageSchema.safeParse({ type: "agent-renamed", id: AGENT_ID, handle: "Not Ok" })
        .success,
    ).toBe(false);
  });

  it("rejects an agent renamed message with extra fields", () => {
    expect(
      LiveMessageSchema.safeParse({
        type: "agent-renamed",
        id: AGENT_ID,
        handle: "sleepy-otter-42",
        oldHandle: "sneaky-panda-7",
      }).success,
    ).toBe(false);
  });
});
