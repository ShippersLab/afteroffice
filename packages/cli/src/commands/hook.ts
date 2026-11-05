import { spawn } from "node:child_process";

const MAX_STDIN_BYTES = 16 * 1024 * 1024;

export async function readStdin(): Promise<string> {
  if (process.stdin.isTTY) {
    return "";
  }
  const chunks: Buffer[] = [];
  let size = 0;
  for await (const chunk of process.stdin) {
    const buffer = Buffer.from(chunk);
    size += buffer.length;
    if (size > MAX_STDIN_BYTES) {
      return "";
    }
    chunks.push(buffer);
  }
  return Buffer.concat(chunks).toString("utf8");
}

export async function runHook(eventName: string): Promise<void> {
  try {
    const payload = await readStdin();
    const entry = process.argv[1];
    if (entry === undefined) {
      return;
    }
    const child = spawn(process.execPath, [entry, "hook-run", eventName], {
      detached: true,
      stdio: ["pipe", "ignore", "ignore"],
    });
    child.on("error", () => undefined);
    child.stdin.on("error", () => undefined);
    await new Promise<void>((resolve) => child.stdin.end(payload, resolve));
    child.unref();
  } catch {
    return;
  }
}
