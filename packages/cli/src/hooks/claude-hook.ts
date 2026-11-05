import { z } from "zod";
import type { SessionSignal } from "../utilities/signal";
import { mapToolNameToCategory } from "./tool-category";

const HookPayloadSchema = z.object({
  session_id: z.string().min(1).max(512),
  tool_name: z.string().max(256).optional(),
  notification_type: z.string().max(64).optional(),
});

export const CLAUDE_HOOK_EVENTS = [
  "SessionStart",
  "PreToolUse",
  "PostToolUseFailure",
  "Notification",
  "Stop",
  "SubagentStart",
  "PreCompact",
  "SessionEnd",
] as const;

export type ClaudeHookEvent = (typeof CLAUDE_HOOK_EVENTS)[number];

export type ClaudeHookReport = { harnessSessionId: string; signal: SessionSignal };

function isClaudeHookEvent(name: string): name is ClaudeHookEvent {
  return (CLAUDE_HOOK_EVENTS as readonly string[]).includes(name);
}

function signalFor(
  event: ClaudeHookEvent,
  toolName: string | undefined,
  notificationType: string | undefined,
): SessionSignal | undefined {
  switch (event) {
    case "SessionStart":
      return { type: "enter", agent: "claude-code" };
    case "PreToolUse":
      return { type: "work", tool: mapToolNameToCategory(toolName ?? "") };
    case "PostToolUseFailure":
      return { type: "error" };
    case "Notification":
      if (notificationType === "permission_prompt") {
        return { type: "waiting" };
      }
      return notificationType === "idle_prompt" ? { type: "idle" } : undefined;
    case "Stop":
      return { type: "done" };
    case "SubagentStart":
      return { type: "work", tool: "subagent" };
    case "PreCompact":
      return { type: "idle" };
    case "SessionEnd":
      return { type: "leave" };
  }
}

export function mapClaudeHook(eventName: string, payload: unknown): ClaudeHookReport | undefined {
  if (!isClaudeHookEvent(eventName)) {
    return undefined;
  }
  const parsed = HookPayloadSchema.safeParse(payload);
  if (!parsed.success) {
    return undefined;
  }
  const signal = signalFor(eventName, parsed.data.tool_name, parsed.data.notification_type);
  return signal === undefined ? undefined : { harnessSessionId: parsed.data.session_id, signal };
}
