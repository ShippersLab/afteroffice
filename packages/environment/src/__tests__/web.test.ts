import { describe, expect, it } from "vitest";
import { createWebEnvironment } from "../web";

describe("createWebEnvironment", () => {
  it("applies defaults", () => {
    const environment = createWebEnvironment({});
    expect(environment.VITE_REALTIME_URL).toBe("http://localhost:8787");
  });

  it("rejects an invalid realtime url", () => {
    expect(() => createWebEnvironment({ VITE_REALTIME_URL: "not a url" })).toThrow(
      "Invalid environment variables",
    );
  });
});
