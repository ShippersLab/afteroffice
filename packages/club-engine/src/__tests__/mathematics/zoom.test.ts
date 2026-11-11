import { describe, expect, it } from "vitest";
import { clampZoom, easeOutCubic, fitZoom, stepZoom, tweenZoom } from "../../mathematics/zoom";

describe("zoom", () => {
  it("snaps to the nearest step", () => {
    expect(clampZoom(0.1)).toBe(0.5);
    expect(clampZoom(0.8)).toBe(1);
    expect(clampZoom(2.4)).toBe(2);
    expect(clampZoom(99)).toBe(4);
  });

  it("steps up and down within bounds", () => {
    expect(stepZoom(1, 1)).toBe(2);
    expect(stepZoom(1, -1)).toBe(0.5);
    expect(stepZoom(0.5, -1)).toBe(0.5);
    expect(stepZoom(4, 1)).toBe(4);
  });

  it("fits the largest step and starts phones zoomed out", () => {
    expect(fitZoom(3000, 2000, 1000, 800)).toBe(2);
    expect(fitZoom(1440, 900, 1560, 1010)).toBe(1);
    expect(fitZoom(390, 844, 1560, 1010)).toBe(0.5);
  });

  it("eases out between 0 and 1", () => {
    expect(easeOutCubic(0)).toBe(0);
    expect(easeOutCubic(1)).toBe(1);
    expect(easeOutCubic(0.5)).toBeGreaterThan(0.5);
    expect(easeOutCubic(3)).toBe(1);
  });

  it("tweens between steps and lands on the target", () => {
    expect(tweenZoom(1, 3, 0, 300)).toBe(1);
    expect(tweenZoom(1, 3, 150, 300)).toBeGreaterThan(2);
    expect(tweenZoom(1, 3, 300, 300)).toBe(3);
    expect(tweenZoom(1, 3, 10, 0)).toBe(3);
  });
});
