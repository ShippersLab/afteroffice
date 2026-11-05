import { describe, expect, it } from "vitest";
import { buildCsp } from "../csp";

describe("buildCsp", () => {
  it("keeps default-src self and allows the realtime origin", () => {
    const csp = buildCsp("https://rt.afteroffice.club");
    expect(csp).toContain("default-src 'self'");
    expect(csp).toContain(
      "connect-src 'self' https://rt.afteroffice.club wss://rt.afteroffice.club",
    );
  });
});
