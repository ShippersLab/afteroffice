import { describe, expect, it } from "vitest";
import { ACCESSORIES, AGENT_H, AGENT_W, agentPixels } from "../../sprites/agent-art";
import { bubblePixels, labelPixels } from "../../sprites/label-art";
import { sanitizeText, textWidth } from "../../sprites/pixel-font";
import { Pixels, scaled } from "../../sprites/pixels";

describe("pixels", () => {
  it("builds from a grid and scales with nearest neighbour", () => {
    const pixels = Pixels.fromGrid(["a.", ".a"], { a: 0xff0000 });
    expect(pixels.getColor(0, 0)).toBe(0xff0000);
    expect(pixels.getColor(1, 0)).toBeNull();
    const big = scaled(pixels, 3);
    expect(big.width).toBe(6);
    expect(big.getColor(2, 2)).toBe(0xff0000);
    expect(big.getColor(3, 0)).toBeNull();
  });

  it("shears downward and upward", () => {
    const pixels = Pixels.fromGrid(["aa"], { a: 0x00ff00 });
    const down = scaled(pixels, 4, 0.5);
    expect(down.height).toBe(4 + 4);
    const up = scaled(pixels, 4, -0.5);
    expect(up.getColor(0, 4)).toBe(0x00ff00);
  });
});

describe("pixel font", () => {
  it("uppercases, caps length and replaces unknown characters", () => {
    expect(sanitizeText("sleepy-otter-42", 32)).toBe("SLEEPY-OTTER-42");
    expect(sanitizeText("<b>x</b>", 32)).toBe("?B?X??B?");
    expect(sanitizeText("a".repeat(50), 32)).toHaveLength(32);
    expect(textWidth("AB")).toBe(7);
  });

  it("draws labels and bubbles without throwing on odd input", () => {
    expect(labelPixels("mango-fox", true).width).toBeGreaterThan(
      labelPixels("mango-fox", false).width,
    );
    expect(bubblePixels("<script>alert(1)</script>").width).toBeGreaterThan(0);
  });
});

describe("agent art", () => {
  it("renders 13x18 sprites for every pose and accessory", () => {
    for (const accessory of ACCESSORIES) {
      for (const pose of ["stand", "dance", "dj", "bar", "sleep", "door", "spill"] as const) {
        const pixels = agentPixels(1, accessory, pose, 1);
        expect(pixels.width).toBe(AGENT_W);
        expect(pixels.height).toBe(AGENT_H);
      }
    }
  });
});
