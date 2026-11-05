import { describe, expect, it } from "vitest";
import {
  CLUB,
  FAQ,
  FAQ_TITLE,
  FOOTER,
  HERO,
  HOW_IT_WORKS,
  JOIN,
  NAV_LINKS,
  NOT_FOUND,
  PRIVACY,
  ROUTES,
  SITE,
  SPONSORS,
} from "../index";

const copy = JSON.stringify([
  CLUB,
  FAQ,
  FAQ_TITLE,
  FOOTER,
  HERO,
  HOW_IT_WORKS,
  JOIN,
  NAV_LINKS,
  NOT_FOUND,
  PRIVACY,
  ROUTES,
  SITE,
  SPONSORS,
]);

describe("copy rules", () => {
  it("has no em dash, exclamation mark or emoji", () => {
    expect(copy).not.toContain("\u2014");
    expect(copy).not.toContain("!");
    expect(copy).not.toMatch(/\p{Extended_Pictographic}/u);
  });

  it("keeps the faq between six and eight entries", () => {
    expect(FAQ.length).toBeGreaterThanOrEqual(6);
    expect(FAQ.length).toBeLessThanOrEqual(8);
  });
});
