import { mkdtemp, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { runFloor } from "../../commands/floor";
import { writeSession } from "../../session/session-store";
import { type Identity, writeIdentity } from "../../storage/identity-store";

const identity: Identity = {
  handle: "old-name",
  token: "t".repeat(32),
  url: "http://127.0.0.1:9999",
};

let home: string;
let stdout: string;
let stdoutSpy: ReturnType<typeof vi.spyOn>;

beforeEach(async () => {
  home = await mkdtemp(join(tmpdir(), "ao-floor-"));
  process.env.AFTEROFFICE_HOME = home;
  process.env.AFTEROFFICE_WEB_URL = "https://club.test";
  stdout = "";
  stdoutSpy = vi.spyOn(process.stdout, "write").mockImplementation((chunk: string | Uint8Array) => {
    stdout += chunk.toString();
    return true;
  });
});

afterEach(async () => {
  stdoutSpy.mockRestore();
  await rm(home, { recursive: true, force: true });
  delete process.env.AFTEROFFICE_HOME;
  delete process.env.AFTEROFFICE_WEB_URL;
});

describe("runFloor", () => {
  it("exits when there is no identity", async () => {
    expect(await runFloor()).toBe(1);
    expect(stdout).toBe("Not joined yet. Run: afteroffice join\n");
  });

  it("reports when no session is on the floor", async () => {
    await writeIdentity(identity);
    expect(await runFloor()).toBe(0);
    expect(stdout).toBe(
      "Your agent is not on the floor yet. It shows up when it starts working.\n",
    );
  });

  it("shows the floor of a running session", async () => {
    await writeIdentity(identity);
    await writeSession("abcdefghijklmnop", { roomId: "floor-7", lastHeartbeat: Date.now() });
    expect(await runFloor()).toBe(0);
    expect(stdout).toBe("You are on floor-7 (1 session)\nWatch the club: https://club.test\n");
  });

  it("counts sessions per floor", async () => {
    await writeIdentity(identity);
    await writeSession("abcdefghijklmnop", { roomId: "floor-7", lastHeartbeat: Date.now() });
    await writeSession("qrstuvwxyzabcdef", { roomId: "floor-7", lastHeartbeat: Date.now() });
    await writeSession("ghijklmnopqrstuv", { roomId: "floor-3", lastHeartbeat: Date.now() });
    expect(await runFloor()).toBe(0);
    expect(stdout).toContain("You are on floor-7 (2 sessions)\n");
    expect(stdout).toContain("You are on floor-3 (1 session)\n");
    expect(stdout).toContain("Watch the club: https://club.test\n");
  });
});
