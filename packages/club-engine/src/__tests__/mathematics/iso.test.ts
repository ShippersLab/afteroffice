import { describe, expect, it } from "vitest";
import { feetDepth, screenToTile, tileCenter, tileToScreen } from "../../mathematics/iso";

describe("iso", () => {
  it("maps the origin tile to the top of the diamond", () => {
    expect(tileToScreen(0, 0)).toEqual({ x: 0, y: 0 });
    expect(tileToScreen(1, 0)).toEqual({ x: 40, y: 20 });
    expect(tileToScreen(0, 1)).toEqual({ x: -40, y: 20 });
  });

  it("round trips screen and tile coordinates", () => {
    const screen = tileToScreen(5.5, 3.25);
    const tile = screenToTile(screen.x, screen.y);
    expect(tile.x).toBeCloseTo(5.5);
    expect(tile.y).toBeCloseTo(3.25);
  });

  it("centers a tile and sorts by depth", () => {
    expect(tileCenter(0, 0)).toEqual({ x: 0, y: 20 });
    expect(feetDepth(2, 3)).toBeGreaterThan(feetDepth(2, 2));
  });
});
