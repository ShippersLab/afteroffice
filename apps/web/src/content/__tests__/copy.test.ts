import { describe, expect, it } from "vitest";
import {
  CLUB,
  FOOTER,
  HERO,
  HOW_IT_WORKS,
  JOIN,
  NAV_LINKS,
  NAVBAR_LINKS,
  NOT_FOUND,
  PRIVACY,
  ROUTES,
  SITE,
  SPONSORS,
} from "../index";

const copy = JSON.stringify([
  CLUB,
  FOOTER,
  HERO,
  HOW_IT_WORKS,
  JOIN,
  NAV_LINKS,
  NAVBAR_LINKS,
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
});
