import { afterEach, describe, expect, it, vi } from "vitest";
import { hasFlag, setFlag } from "../session-flag";

const stubStorage = (storage: unknown) => {
  vi.stubGlobal("window", { sessionStorage: storage });
};

afterEach(() => vi.unstubAllGlobals());

describe("session flag", () => {
  it("remembers a flag", () => {
    const store = new Map<string, string>();
    stubStorage({
      getItem: (key: string) => store.get(key) ?? null,
      setItem: (key: string, value: string) => store.set(key, value),
    });
    expect(hasFlag("a")).toBe(false);
    setFlag("a");
    expect(hasFlag("a")).toBe(true);
  });

  it("survives blocked storage", () => {
    const blocked = {
      getItem: () => {
        throw new Error("blocked");
      },
      setItem: () => {
        throw new Error("blocked");
      },
    };
    stubStorage(blocked);
    expect(hasFlag("a")).toBe(false);
    expect(() => setFlag("a")).not.toThrow();
  });
});
