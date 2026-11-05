import { beforeEach, describe, expect, it, vi } from "vitest";
import { app } from "../../app";
import type { Env } from "../../configuration/env";
import { cacheHandle, clearAccountCache } from "../../services/account-cache";
import { hashToken } from "../../services/tokens";

const TOKEN = "t".repeat(43);
const SESSION = "s".repeat(20);

function makeEnv(limit = true) {
  const apply = vi.fn<() => Promise<boolean>>().mockResolvedValue(true);
  const enter = vi.fn<() => Promise<boolean>>().mockResolvedValue(true);
  const limiter = {
    limit: vi.fn<() => Promise<{ success: boolean }>>().mockResolvedValue({ success: limit }),
  };
  const env = {
    HYPERDRIVE: { connectionString: "postgresql://x:x@127.0.0.1:1/x" },
    JOIN_LIMITER: limiter,
    EVENTS_LIMITER: limiter,
    LIVE_LIMITER: limiter,
    DIRECTORY: {
      getByName: () => ({ assign: () => "floor-1", stats: () => ({ online: 2, floors: 1 }) }),
    },
    FLOOR: { getByName: () => ({ apply, enter }) },
  } as unknown as Env;
  return { env, apply, enter };
}

const executionCtx = { waitUntil: () => undefined, passThroughOnException: () => undefined };

function post(env: Env, body: string, authorized = true) {
  const headers: Record<string, string> = { "content-type": "application/json" };
  if (authorized) {
    headers["authorization"] = `Bearer ${TOKEN}`;
  }
  return app.request("/v1/events", { method: "POST", headers, body }, env, executionCtx as never);
}

describe("app", () => {
  beforeEach(async () => {
    clearAccountCache();
    cacheHandle(await hashToken(TOKEN), "sleepy-otter-42");
  });

  it("answers health with security headers", async () => {
    const response = await app.request("/health", {}, makeEnv().env, executionCtx as never);
    expect(response.status).toBe(200);
    expect(response.headers.get("x-content-type-options")).toBe("nosniff");
    expect(response.headers.get("cache-control")).toBe("no-store");
  });

  it("serves stats with CORS", async () => {
    const response = await app.request("/v1/stats", {}, makeEnv().env, executionCtx as never);
    expect(await response.json()).toEqual({ online: 2, floors: 1 });
    expect(response.headers.get("access-control-allow-origin")).toBe("*");
  });

  it("returns 404 json for unknown routes", async () => {
    const response = await app.request("/nope", {}, makeEnv().env, executionCtx as never);
    expect(response.status).toBe(404);
  });

  it("rejects events without a token", async () => {
    const response = await post(makeEnv().env, "{}", false);
    expect(response.status).toBe(401);
  });

  it("rate limits events", async () => {
    const response = await post(makeEnv(false).env, "{}");
    expect(response.status).toBe(429);
  });

  it("returns 413 for oversized bodies", async () => {
    const response = await post(makeEnv().env, "x".repeat(2_000));
    expect(response.status).toBe(413);
  });

  it("returns 400 for invalid events", async () => {
    expect((await post(makeEnv().env, '{"type":"nope"}')).status).toBe(400);
    expect((await post(makeEnv().env, "{bad")).status).toBe(400);
  });

  it("assigns a floor on enter", async () => {
    const { env, enter } = makeEnv();
    const response = await post(
      env,
      JSON.stringify({ type: "enter", sessionId: SESSION, agent: "opencode" }),
    );
    expect(response.status).toBe(200);
    expect(await response.json()).toEqual({ roomId: "floor-1", vip: false });
    expect(enter).toHaveBeenCalledWith("floor-1", SESSION, "sleepy-otter-42", "opencode");
  });

  it("returns 204 for other events and 409 for unknown sessions", async () => {
    const { env, apply } = makeEnv();
    const body = JSON.stringify({ type: "heartbeat", sessionId: SESSION, roomId: "floor-1" });
    expect((await post(env, body)).status).toBe(204);
    apply.mockResolvedValue(false);
    expect((await post(env, body)).status).toBe(409);
  });

  it("requires a websocket upgrade on live", async () => {
    const response = await app.request("/v1/live", {}, makeEnv().env, executionCtx as never);
    expect(response.status).toBe(426);
  });
});
