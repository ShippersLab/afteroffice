import { beforeEach, describe, expect, it } from "vitest";
import { ACCOUNT_CACHE_TTL_MS } from "../../configuration/constants";
import { cacheHandle, clearAccountCache, getCachedHandle } from "../../services/account-cache";

describe("account cache", () => {
  beforeEach(() => {
    clearAccountCache();
  });

  it("returns a handle until it expires", () => {
    cacheHandle("hash", "sleepy-otter-42", 1_000);
    expect(getCachedHandle("hash", 1_000 + ACCOUNT_CACHE_TTL_MS - 1)).toBe("sleepy-otter-42");
    expect(getCachedHandle("hash", 1_000 + ACCOUNT_CACHE_TTL_MS)).toBeNull();
  });

  it("misses unknown hashes", () => {
    expect(getCachedHandle("nope")).toBeNull();
  });
});
