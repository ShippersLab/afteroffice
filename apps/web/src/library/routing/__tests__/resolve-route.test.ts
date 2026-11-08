import { describe, expect, it } from "vitest";
import { ROUTES } from "../../../content/routes";
import { canonicalUrl, normalizePathname, resolveRoute } from "../resolve-route";

describe("resolveRoute", () => {
  it("finds every known route", () => {
    for (const route of ROUTES) {
      expect(resolveRoute(route.path)).toBe(route);
    }
  });

  it("ignores a trailing slash", () => {
    expect(resolveRoute("/join/")?.path).toBe("/join");
    expect(normalizePathname("/")).toBe("/");
  });

  it("returns nothing for unknown paths", () => {
    expect(resolveRoute("/nope")).toBeUndefined();
  });
});

describe("canonicalUrl", () => {
  it("builds absolute urls on the site origin", () => {
    expect(canonicalUrl("/")).toBe("https://afteroffice.club/");
    expect(canonicalUrl("/join")).toBe("https://afteroffice.club/join");
  });
});

describe("route table", () => {
  it("has unique paths, titles and descriptions", () => {
    expect(new Set(ROUTES.map((route) => route.path)).size).toBe(ROUTES.length);
    expect(new Set(ROUTES.map((route) => route.title)).size).toBe(ROUTES.length);
    expect(new Set(ROUTES.map((route) => route.description)).size).toBe(ROUTES.length);
  });
});
