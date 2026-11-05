import { describe, expect, it } from "vitest";
import { generateToken, hashToken } from "../../services/tokens";

describe("tokens", () => {
  it("generates 32 random bytes as base64url", () => {
    const token = generateToken();
    expect(token).toMatch(/^[A-Za-z0-9_-]{43}$/);
    expect(generateToken()).not.toBe(token);
  });

  it("hashes with sha256 hex", async () => {
    expect(await hashToken("abc")).toBe(
      "ba7816bf8f01cfea414140de5dae2223b00361a396177a9cb410ff61f20015ad",
    );
  });
});
