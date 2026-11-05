import { describe, expect, it } from "vitest";
import { clampZoom, fitZoom, stepZoom } from "../../mathematics/zoom";

describe("zoom", () => {
  it("clamps to integer steps", () => {
    expect(clampZoom(0.3)).toBe(1);
    expect(clampZoom(2.4)).toBe(2);
    expect(clampZoom(99)).toBe(4);
  });

  it("steps up and down within bounds", () => {
    expect(stepZoom(1, 1)).toBe(2);
    expect(stepZoom(1, -1)).toBe(1);
    expect(stepZoom(4, 1)).toBe(4);
  });

  it("fits the largest integer zoom", () => {
    expect(fitZoom(3000, 2000, 1000, 800)).toBe(2);
    expect(fitZoom(500, 500, 1000, 800)).toBe(1);
  });
});
