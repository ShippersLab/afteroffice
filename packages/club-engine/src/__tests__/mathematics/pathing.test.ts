import { describe, expect, it } from "vitest";
import { findPath } from "../../mathematics/pathing";
import { DOOR_TILE, isWalkable } from "../../state/layout";
import { rulesFor } from "../../state/path-rules";

describe("findPath", () => {
  it("returns an empty path when already there", () => {
    expect(findPath({ x: 3, y: 3 }, { x: 3, y: 3 }, rulesFor(false))).toEqual([]);
  });

  it("walks tile by tile and avoids furniture", () => {
    const path = findPath(DOOR_TILE, { x: 3, y: 0 }, rulesFor(false));
    expect(path).not.toBeNull();
    let prev = DOOR_TILE;
    for (const step of path ?? []) {
      expect(Math.abs(step.x - prev.x) + Math.abs(step.y - prev.y)).toBe(1);
      expect(isWalkable(step)).toBe(true);
      prev = step;
    }
    expect(prev).toEqual({ x: 3, y: 0 });
  });

  it("refuses blocked targets", () => {
    expect(findPath(DOOR_TILE, { x: 6, y: 1 }, rulesFor(false))).toBeNull();
  });

  it("keeps regular agents out of the VIP corner but lets VIPs in", () => {
    expect(findPath(DOOR_TILE, { x: 15, y: 3 }, rulesFor(false))).toBeNull();
    expect(findPath(DOOR_TILE, { x: 15, y: 3 }, rulesFor(true))).not.toBeNull();
  });
});
