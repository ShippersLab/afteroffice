import { HandleSchema } from "@afteroffice/core";
import { describe, expect, it } from "vitest";
import { ADJECTIVES, ANIMALS, generateHandle } from "../../services/handles";

describe("generateHandle", () => {
  it("always matches HandleSchema", () => {
    for (let index = 0; index < 500; index += 1) {
      expect(HandleSchema.safeParse(generateHandle()).success).toBe(true);
    }
  });

  it("is deterministic for a fixed random source", () => {
    expect(generateHandle(() => 0)).toBe(`${ADJECTIVES[0]}-${ANIMALS[0]}-10`);
  });

  it("stays within the number range at the top end", () => {
    expect(generateHandle(() => 0.999999)).toMatch(/-999$/);
  });
});
