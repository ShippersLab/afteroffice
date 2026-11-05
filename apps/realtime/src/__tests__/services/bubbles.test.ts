import { AGENT_STATES, MAX_BUBBLE_LENGTH } from "@afteroffice/core";
import { describe, expect, it } from "vitest";
import { BUBBLE_TEMPLATES, pickBubble } from "../../services/bubbles";

describe("bubble templates", () => {
  it("cover every state with short, clean text", () => {
    for (const state of AGENT_STATES) {
      const templates = BUBBLE_TEMPLATES[state];
      expect(templates.length).toBeGreaterThan(0);
      for (const text of templates) {
        expect(text.length).toBeLessThanOrEqual(MAX_BUBBLE_LENGTH);
        expect(text).toMatch(/^[A-Z][A-Za-z ,'.]*$/);
      }
    }
  });
});

describe("pickBubble", () => {
  it("speaks about one time in three", () => {
    expect(pickBubble("dancing", () => 0.5)).toBeNull();
    expect(pickBubble("dancing", () => 0.1)).not.toBeNull();
  });

  it("uses a template of the given state", () => {
    const text = pickBubble("spilled-drink", () => 0);
    expect(BUBBLE_TEMPLATES["spilled-drink"]).toContain(text);
  });
});
