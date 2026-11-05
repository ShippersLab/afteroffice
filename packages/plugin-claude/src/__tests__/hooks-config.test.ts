import { CLAUDE_HOOK_EVENTS, mapClaudeHook } from "@afteroffice/cli";
import { describe, expect, it } from "vitest";
import config from "../../hooks/hooks.json";

describe("hooks.json", () => {
  it("registers exactly the events the cli understands", () => {
    expect(Object.keys(config.hooks).toSorted()).toEqual([...CLAUDE_HOOK_EVENTS].toSorted());
  });

  it.each(Object.entries(config.hooks))("%s is silent, fast and calls the cli", (event, groups) => {
    for (const group of groups) {
      for (const hook of group.hooks) {
        expect(hook.command).toBe(`afteroffice hook ${event} >/dev/null 2>&1 || true`);
        expect(hook.timeout).toBeLessThanOrEqual(5);
      }
    }
    expect(
      mapClaudeHook(event, { session_id: "s", notification_type: "idle_prompt" }),
    ).toBeDefined();
  });

  it("limits notifications to permission and idle prompts", () => {
    expect(config.hooks.Notification[0]?.matcher).toBe("permission_prompt|idle_prompt");
  });
});
