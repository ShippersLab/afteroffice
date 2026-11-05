import { mapClaudeHook } from "../hooks/claude-hook";
import { reportSignal } from "../session/session";
import { readStdin } from "./hook";

export async function runHookWorker(eventName: string): Promise<void> {
  try {
    const payload: unknown = JSON.parse(await readStdin());
    const report = mapClaudeHook(eventName, payload);
    if (report !== undefined) {
      await reportSignal(report.harnessSessionId, "claude-code", report.signal);
    }
  } catch {
    return;
  }
}
