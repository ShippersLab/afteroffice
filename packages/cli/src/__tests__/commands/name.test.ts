import { mkdtemp, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { runName } from "../../commands/name";
import { type Identity, readIdentity, writeIdentity } from "../../storage/identity-store";

const TOKEN = "t".repeat(32);

const identity: Identity = {
  handle: "old-name",
  token: TOKEN,
  url: "http://127.0.0.1:9999",
};

let home: string;
let stdout: string;
let stderr: string;
let stdoutSpy: ReturnType<typeof vi.spyOn>;
let stderrSpy: ReturnType<typeof vi.spyOn>;

beforeEach(async () => {
  home = await mkdtemp(join(tmpdir(), "ao-name-"));
  process.env.AFTEROFFICE_HOME = home;
  process.env.AFTEROFFICE_WEB_URL = "https://club.test";
  stdout = "";
  stderr = "";
  stdoutSpy = vi.spyOn(process.stdout, "write").mockImplementation((chunk: string | Uint8Array) => {
    stdout += chunk.toString();
    return true;
  });
  stderrSpy = vi.spyOn(process.stderr, "write").mockImplementation((chunk: string | Uint8Array) => {
    stderr += chunk.toString();
    return true;
  });
});

afterEach(async () => {
  stdoutSpy.mockRestore();
  stderrSpy.mockRestore();
  vi.unstubAllGlobals();
  await rm(home, { recursive: true, force: true });
  delete process.env.AFTEROFFICE_HOME;
  delete process.env.AFTEROFFICE_WEB_URL;
});

describe("runName", () => {
  it("renames the handle and rewrites the identity", async () => {
    await writeIdentity(identity);
    const requests: { url: string; init: RequestInit | undefined }[] = [];
    vi.stubGlobal("fetch", async (url: string, init?: RequestInit) => {
      requests.push({ url, init });
      return new Response(JSON.stringify({ handle: "new-name" }), {
        status: 200,
        headers: { "content-type": "application/json" },
      });
    });
    expect(await runName(["new-name"])).toBe(0);
    expect(stdout).toBe("Renamed to new-name\nhttps://club.test/@new-name\n");
    expect((await readIdentity())?.handle).toBe("new-name");
    expect(requests[0]?.url).toBe(`${identity.url}/v1/name`);
    expect(requests[0]?.init?.headers).toMatchObject({ authorization: `Bearer ${TOKEN}` });
    expect(JSON.parse(String(requests[0]?.init?.body))).toEqual({ handle: "new-name" });
  });

  it("maps a taken handle to exit code 1", async () => {
    await writeIdentity(identity);
    vi.stubGlobal(
      "fetch",
      async () =>
        new Response(JSON.stringify({ error: "handle_taken" }), {
          status: 409,
          headers: { "content-type": "application/json" },
        }),
    );
    expect(await runName(["new-name"])).toBe(1);
    expect(stderr).toBe("That name is taken. Try another one.\n");
    expect((await readIdentity())?.handle).toBe("old-name");
  });

  it("rejects an invalid handle before calling the club", async () => {
    await writeIdentity(identity);
    const fetchMock = vi.fn<() => never>();
    vi.stubGlobal("fetch", fetchMock);
    expect(await runName(["AB"])).toBe(1);
    expect(fetchMock).not.toHaveBeenCalled();
    expect(stdout).toBe(
      "Pick a name with 3 to 32 characters: lowercase letters, digits and hyphens.\n",
    );
  });

  it("exits when there is no identity", async () => {
    const fetchMock = vi.fn<() => never>();
    vi.stubGlobal("fetch", fetchMock);
    expect(await runName(["new-name"])).toBe(1);
    expect(fetchMock).not.toHaveBeenCalled();
    expect(stdout).toBe("Not joined yet. Run: afteroffice join\n");
  });

  it("prints usage without an argument", async () => {
    await writeIdentity(identity);
    expect(await runName([])).toBe(1);
    expect(stdout).toBe("Usage: afteroffice name <handle>\n");
  });
});
