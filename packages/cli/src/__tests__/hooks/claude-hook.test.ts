import { ClubEventSchema } from "@afteroffice/core";
import { describe, expect, it } from "vitest";
import { mapClaudeHook } from "../../hooks/claude-hook";
import { deriveSessionId } from "../../session/session-id";
import { toClubEvent } from "../../utilities/signal";

const SECRET_PAYLOAD = {
  session_id: "raw-session-id-123",
  transcript_path: "/home/me/.claude/projects/secret/transcript.jsonl",
  cwd: "/home/me/code/private-repo",
  hook_event_name: "PreToolUse",
  prompt: "my secret prompt",
  tool_name: "Bash",
  tool_input: { command: "cat /home/me/.ssh/id_rsa", file_path: "/home/me/code/secret.ts" },
  tool_response: { output: "secret output" },
  notification_type: "permission_prompt",
  message: "Claude needs permission to edit /home/me/secret.ts",
};

function eventFor(name: string, payload: Record<string, unknown>) {
  const report = mapClaudeHook(name, payload);
  expect(report).toBeDefined();
  if (report === undefined) {
    throw new Error("unmapped");
  }
  return toClubEvent(report.signal, deriveSessionId(report.harnessSessionId), "floor-3");
}

describe("mapClaudeHook", () => {
  it("maps each event", () => {
    const base = { session_id: "s1" };
    expect(eventFor("SessionStart", base).type).toBe("enter");
    expect(eventFor("PreToolUse", { ...base, tool_name: "Grep" })).toMatchObject({
      type: "work",
      tool: "search",
    });
    expect(eventFor("PostToolUseFailure", base).type).toBe("error");
    expect(eventFor("Notification", { ...base, notification_type: "permission_prompt" }).type).toBe(
      "waiting",
    );
    expect(eventFor("Notification", { ...base, notification_type: "idle_prompt" }).type).toBe(
      "idle",
    );
    expect(eventFor("Stop", base).type).toBe("done");
    expect(eventFor("SubagentStart", base)).toMatchObject({ type: "work", tool: "subagent" });
    expect(eventFor("PreCompact", base).type).toBe("idle");
    expect(eventFor("SessionEnd", base).type).toBe("leave");
  });

  it("ignores unknown events, other notifications and bad payloads", () => {
    expect(mapClaudeHook("UserPromptSubmit", { session_id: "s" })).toBeUndefined();
    expect(mapClaudeHook("Notification", { session_id: "s", notification_type: "auth" })).toBe(
      undefined,
    );
    expect(mapClaudeHook("Stop", { nope: 1 })).toBeUndefined();
    expect(mapClaudeHook("Stop", null)).toBeUndefined();
  });

  it.each([
    "SessionStart",
    "PreToolUse",
    "PostToolUseFailure",
    "Notification",
    "Stop",
    "SessionEnd",
  ])("%s with sensitive payload yields only allowed fields", (name) => {
    const event = eventFor(name, SECRET_PAYLOAD);
    const parsed = ClubEventSchema.safeParse(event);
    expect(parsed.success).toBe(true);
    const json = JSON.stringify(event);
    for (const leak of ["/home", "secret", "cat ", "raw-session-id", ".ts", "prompt"]) {
      expect(json).not.toContain(leak);
    }
  });

  it("sends only the tool category for Bash and Edit", () => {
    expect(eventFor("PreToolUse", SECRET_PAYLOAD)).toEqual({
      type: "work",
      sessionId: deriveSessionId("raw-session-id-123"),
      roomId: "floor-3",
      tool: "bash",
    });
  });
});
