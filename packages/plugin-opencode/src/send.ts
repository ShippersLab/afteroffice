import { reportSignal, type SessionSignal } from "@afteroffice/cli";

export function fireAndForget(harnessSessionId: string, signal: SessionSignal): void {
  void reportSignal(harnessSessionId, "opencode", signal).catch(() => undefined);
}
