import { SessionIdSchema } from "@afteroffice/core";
import { describe, expect, it } from "vitest";
import { deriveSessionId } from "../../session/session-id";

describe("deriveSessionId", () => {
  it("is stable, valid and hides the raw id", () => {
    const raw = "7f3c9a52-0000-4d1e-9a11-aaaaaaaaaaaa";
    const id = deriveSessionId(raw);
    expect(id).toBe(deriveSessionId(raw));
    expect(id).toHaveLength(32);
    expect(SessionIdSchema.safeParse(id).success).toBe(true);
    expect(id).not.toContain(raw.slice(0, 8));
    expect(deriveSessionId("other")).not.toBe(id);
  });
});
