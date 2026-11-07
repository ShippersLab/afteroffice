import { execFile } from "node:child_process";
import { mkdtemp, rm, symlink } from "node:fs/promises";
import { tmpdir } from "node:os";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { promisify } from "node:util";
import { describe, expect, it } from "vitest";

const run = promisify(execFile);

const here = dirname(fileURLToPath(import.meta.url));
const launcher = join(here, "../../bin/afteroffice");

describe("bin/afteroffice", () => {
  it("runs through a symlink by resolving the real launcher path", async () => {
    const dir = await mkdtemp(join(tmpdir(), "afteroffice-launcher-"));
    try {
      const link = join(dir, "afteroffice");
      await symlink(launcher, link);
      const { stdout } = await run(link, [], {
        env: { ...process.env, AFTEROFFICE_HOME: join(dir, "home") },
      });
      expect(stdout).toContain("Usage:");
    } finally {
      await rm(dir, { recursive: true, force: true });
    }
  }, 10_000);
});
