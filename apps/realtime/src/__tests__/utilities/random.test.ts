import { describe, expect, it } from "vitest";
import { pick, randomInt, randomPublicId } from "../../utilities/random";

describe("random helpers", () => {
  it("builds public ids that match the core schema shape", () => {
    expect(randomPublicId()).toMatch(/^[a-z0-9]{12}$/);
  });

  it("randomInt stays below max", () => {
    expect(randomInt(10, () => 0.999)).toBe(9);
  });

  it("pick returns undefined for empty lists", () => {
    expect(pick([], () => 0)).toBeUndefined();
  });
});
