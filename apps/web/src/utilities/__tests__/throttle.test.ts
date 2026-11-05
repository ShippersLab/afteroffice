import { describe, expect, it } from "vitest";
import { createThrottle } from "../throttle";

describe("createThrottle", () => {
  it("lets one call through per interval", () => {
    const allow = createThrottle(1000);
    expect(allow(0)).toBe(true);
    expect(allow(500)).toBe(false);
    expect(allow(1000)).toBe(true);
  });
});
