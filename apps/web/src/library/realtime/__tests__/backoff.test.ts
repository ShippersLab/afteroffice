import { describe, expect, it } from "vitest";
import { BACKOFF_CAP_MS, backoffDelay } from "../backoff";

describe("backoffDelay", () => {
  it("grows with the attempt", () => {
    expect(backoffDelay(0, 1)).toBe(1000);
    expect(backoffDelay(1, 1)).toBe(2000);
    expect(backoffDelay(2, 1)).toBe(4000);
  });

  it("applies jitter between half and full", () => {
    expect(backoffDelay(2, 0)).toBe(2000);
  });

  it("is capped", () => {
    expect(backoffDelay(20, 1)).toBe(BACKOFF_CAP_MS);
  });
});
