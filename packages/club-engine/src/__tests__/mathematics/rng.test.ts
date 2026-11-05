import { describe, expect, it } from "vitest";
import { createRng, hashString } from "../../mathematics/rng";

describe("rng", () => {
  it("is deterministic per seed", () => {
    const a = createRng(hashString("agent-1"));
    const b = createRng(hashString("agent-1"));
    expect([a.next(), a.next(), a.next()]).toEqual([b.next(), b.next(), b.next()]);
  });

  it("differs between seeds and stays in range", () => {
    const a = createRng(hashString("a"));
    const b = createRng(hashString("b"));
    expect(a.next()).not.toBe(b.next());
    for (let i = 0; i < 100; i += 1) {
      const value = a.int(5);
      expect(value).toBeGreaterThanOrEqual(0);
      expect(value).toBeLessThan(5);
    }
  });

  it("picks from a list and handles empty lists", () => {
    const rng = createRng(1);
    expect([1, 2, 3]).toContain(rng.pick([1, 2, 3]));
    expect(rng.pick([])).toBeUndefined();
  });
});
