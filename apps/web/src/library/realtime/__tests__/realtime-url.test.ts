import { describe, expect, it } from "vitest";
import { buildLiveUrl, realtimeOrigins } from "../realtime-url";

describe("buildLiveUrl", () => {
  it("defaults to local realtime", () => {
    expect(buildLiveUrl(undefined)).toBe("ws://localhost:8787/v1/live");
  });

  it("maps https to wss", () => {
    expect(buildLiveUrl("https://rt.afteroffice.club")).toBe("wss://rt.afteroffice.club/v1/live");
  });

  it("maps http to ws and drops path and query", () => {
    expect(buildLiveUrl("http://example.com:1/x?y=1")).toBe("ws://example.com:1/v1/live");
  });

  it("falls back on blank input", () => {
    expect(buildLiveUrl("  ")).toBe("ws://localhost:8787/v1/live");
  });
});

describe("realtimeOrigins", () => {
  it("lists both realtime origins", () => {
    expect(realtimeOrigins("https://rt.afteroffice.club")).toEqual([
      "https://rt.afteroffice.club",
      "wss://rt.afteroffice.club",
    ]);
  });
});
