import { mkdtemp, readdir, rm, stat } from "node:fs/promises";
import { createServer, type Server } from "node:http";
import type { AddressInfo } from "node:net";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { ClubEventSchema } from "@afteroffice/core";
import { afterEach, beforeEach, describe, expect, it } from "vitest";
import { join as joinClub, sendEvent } from "../../client/http-client";
import { reportSignal } from "../../session/session";
import { deriveSessionId } from "../../session/session-id";
import { listSessionIds } from "../../session/session-store";
import { readIdentity } from "../../storage/identity-store";

type Received = { auth: string | undefined; body: unknown };

let server: Server;
let home: string;
let received: Received[];
let status: number;

beforeEach(async () => {
  received = [];
  status = 200;
  home = await mkdtemp(join(tmpdir(), "ao-test-"));
  process.env.AFTEROFFICE_HOME = home;
  server = createServer((req, res) => {
    const chunks: Buffer[] = [];
    req.on("data", (chunk: Buffer) => chunks.push(chunk));
    req.on("end", () => {
      const body: unknown = JSON.parse(Buffer.concat(chunks).toString("utf8") || "null");
      received.push({ auth: req.headers.authorization, body });
      if (req.url === "/v1/join") {
        res.writeHead(201, { "content-type": "application/json" });
        res.end(JSON.stringify({ handle: "sleepy-otter-42", token: "t".repeat(32) }));
        return;
      }
      if (status !== 200) {
        res.writeHead(status).end();
        return;
      }
      const type = (body as { type?: string }).type;
      if (type === "enter") {
        res.writeHead(200, { "content-type": "application/json" });
        res.end(JSON.stringify({ roomId: "floor-2", vip: false }));
        return;
      }
      res.writeHead(204).end();
    });
  });
  await new Promise<void>((resolve) => server.listen(0, "127.0.0.1", resolve));
  process.env.AFTEROFFICE_URL = `http://127.0.0.1:${(server.address() as AddressInfo).port}`;
});

afterEach(async () => {
  await new Promise((resolve) => server.close(resolve));
  await rm(home, { recursive: true, force: true });
  delete process.env.AFTEROFFICE_HOME;
  delete process.env.AFTEROFFICE_URL;
});

describe("identity and sending", () => {
  it("joins and stores identity with private permissions", async () => {
    const result = await joinClub();
    expect(result).toMatchObject({ ok: true });
    expect((await readIdentity())?.handle).toBe("sleepy-otter-42");
    expect((await stat(home)).mode & 0o777).toBe(0o700);
    expect((await stat(join(home, "identity.json"))).mode & 0o777).toBe(0o600);
  });

  it("does nothing without identity", async () => {
    expect(await reportSignal("s1", "claude-code", { type: "done" })).toEqual({
      ok: false,
      reason: "no-identity",
    });
    expect(received).toHaveLength(0);
  });

  it("never throws when the club is down", async () => {
    await joinClub();
    await new Promise((resolve) => server.close(resolve));
    const result = await sendEvent({
      type: "idle",
      sessionId: deriveSessionId("x"),
      roomId: "floor-1",
    });
    expect(result.ok).toBe(false);
    server = createServer();
  });
});

describe("reportSignal", () => {
  it("enters implicitly, sends strictly valid events and cleans up on leave", async () => {
    await joinClub();
    received.length = 0;
    await reportSignal("raw-id", "claude-code", { type: "work", tool: "bash" });
    await reportSignal("raw-id", "claude-code", { type: "leave" });
    const bodies = received.map((r) => r.body);
    for (const body of bodies) {
      expect(ClubEventSchema.safeParse(body).success).toBe(true);
    }
    expect(bodies.map((b) => (b as { type: string }).type)).toEqual(["enter", "work", "leave"]);
    expect(received.every((r) => r.auth === `Bearer ${"t".repeat(32)}`)).toBe(true);
    expect(JSON.stringify(bodies)).not.toContain("raw-id");
    expect(await listSessionIds()).toEqual([]);
  });

  it("sends a heartbeat when the last one is old", async () => {
    await joinClub();
    await reportSignal("hb", "opencode", { type: "enter", agent: "opencode" });
    const sessionFile = (await readdir(join(home, "sessions")))[0] ?? "";
    expect(sessionFile).toMatch(/\.json$/);
    const { writeSession } = await import("../../session/session-store");
    await writeSession(deriveSessionId("hb"), { roomId: "floor-2", lastHeartbeat: 0 });
    received.length = 0;
    await reportSignal("hb", "opencode", { type: "idle" });
    const types = received.map((r) => (r.body as { type: string }).type).toSorted();
    expect(types).toEqual(["heartbeat", "idle"]);
  });

  it("throttles repeated work of the same category", async () => {
    await joinClub();
    await reportSignal("t", "claude-code", { type: "work", tool: "edit" });
    received.length = 0;
    await reportSignal("t", "claude-code", { type: "work", tool: "edit" });
    expect(received).toHaveLength(0);
    await reportSignal("t", "claude-code", { type: "work", tool: "bash" });
    expect(received.map((r) => (r.body as { type: string }).type)).toEqual(["work"]);
    await reportSignal("t", "claude-code", { type: "done" });
    received.length = 0;
    await reportSignal("t", "claude-code", { type: "work", tool: "bash" });
    expect(received).toHaveLength(1);
  });

  it("drops the session on conflict so the next event re-enters", async () => {
    await joinClub();
    await reportSignal("c", "opencode", { type: "enter", agent: "opencode" });
    status = 409;
    await reportSignal("c", "opencode", { type: "idle" });
    expect(await listSessionIds()).toEqual([]);
  });
});
