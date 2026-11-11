import { describe, expect, it } from "vitest";
import { resolveProfile } from "../profile-route";

describe("resolveProfile", () => {
  it("reads a valid handle", () => {
    expect(resolveProfile("/@sleepy-otter-42")).toBe("sleepy-otter-42");
    expect(resolveProfile("/@sleepy-otter-42/")).toBe("sleepy-otter-42");
  });

  it("rejects everything else", () => {
    expect(resolveProfile("/sleepy-otter-42")).toBeUndefined();
    expect(resolveProfile("/@a")).toBeUndefined();
    expect(resolveProfile("/@Bad_Handle")).toBeUndefined();
    expect(resolveProfile("/@a-b/c")).toBeUndefined();
  });
});
