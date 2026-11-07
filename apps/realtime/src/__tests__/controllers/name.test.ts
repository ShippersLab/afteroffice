import { beforeEach, describe, expect, it, vi } from "vitest";
import { app } from "../../app";
import type { Env } from "../../configuration/env";
import { cacheHandle, clearAccountCache } from "../../services/account-cache";
import type * as Accounts from "../../services/accounts";
import { hashToken } from "../../services/tokens";

const { renameAccount } = vi.hoisted(() => ({
  renameAccount: vi.fn<() => Promise<boolean>>(),
}));

vi.mock("../../services/accounts", async (importOriginal) => {
  const original = await importOriginal<typeof Accounts>();
  return { ...original, renameAccount };
});

const TOKEN = "t".repeat(43);
const CURRENT_HANDLE = "sleepy-otter-42";

function makeEnv(limit = true) {
  const limiter = {
    limit: vi.fn<() => Promise<{ success: boolean }>>().mockResolvedValue({ success: limit }),
  };
  const env = {
    HYPERDRIVE: { connectionString: "postgresql://x:x@127.0.0.1:1/x" },
    EVENTS_LIMITER: limiter,
  } as unknown as Env;
  return env;
}

const executionCtx = { waitUntil: () => undefined, passThroughOnException: () => undefined };

function post(env: Env, body: string, authorized = true) {
  const headers: Record<string, string> = { "content-type": "application/json" };
  if (authorized) {
    headers["authorization"] = `Bearer ${TOKEN}`;
  }
  return app.request("/v1/name", { method: "POST", headers, body }, env, executionCtx as never);
}

describe("name", () => {
  beforeEach(async () => {
    renameAccount.mockReset();
    clearAccountCache();
    cacheHandle(await hashToken(TOKEN), CURRENT_HANDLE);
  });

  it("rejects requests without a token", async () => {
    const response = await post(makeEnv(), JSON.stringify({ handle: "new-handle" }), false);
    expect(response.status).toBe(401);
  });

  it("rate limits renames", async () => {
    const response = await post(makeEnv(false), JSON.stringify({ handle: "new-handle" }));
    expect(response.status).toBe(429);
  });

  it("returns 400 for invalid json and bad handles", async () => {
    const env = makeEnv();
    expect((await post(env, "{bad")).status).toBe(400);
    expect((await post(env, JSON.stringify({ handle: "Not Ok" }))).status).toBe(400);
    expect((await post(env, JSON.stringify({ handle: "ab" }))).status).toBe(400);
    expect(renameAccount).not.toHaveBeenCalled();
  });

  it("returns 409 when the handle is taken", async () => {
    renameAccount.mockResolvedValue(false);
    const response = await post(makeEnv(), JSON.stringify({ handle: "new-handle" }));
    expect(response.status).toBe(409);
    expect(await response.json()).toEqual({ error: "handle_taken" });
    expect(renameAccount).toHaveBeenCalledWith(
      expect.any(Function),
      await hashToken(TOKEN),
      "new-handle",
    );
  });

  it("renames the account", async () => {
    renameAccount.mockResolvedValue(true);
    const response = await post(makeEnv(), JSON.stringify({ handle: "new-handle" }));
    expect(response.status).toBe(200);
    expect(await response.json()).toEqual({ handle: "new-handle" });
  });

  it("succeeds without a query when the handle is unchanged", async () => {
    const response = await post(makeEnv(), JSON.stringify({ handle: CURRENT_HANDLE }));
    expect(response.status).toBe(200);
    expect(await response.json()).toEqual({ handle: CURRENT_HANDLE });
    expect(renameAccount).not.toHaveBeenCalled();
  });
});
