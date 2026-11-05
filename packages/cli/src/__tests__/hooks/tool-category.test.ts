import { describe, expect, it } from "vitest";
import { mapToolNameToCategory } from "../../hooks/tool-category";

describe("mapToolNameToCategory", () => {
  it.each([
    ["Edit", "edit"],
    ["Write", "edit"],
    ["MultiEdit", "edit"],
    ["NotebookEdit", "edit"],
    ["Bash", "bash"],
    ["Read", "read"],
    ["Grep", "search"],
    ["Glob", "search"],
    ["LS", "search"],
    ["WebFetch", "web"],
    ["WebSearch", "web"],
    ["Task", "subagent"],
    ["Agent", "subagent"],
    ["edit", "edit"],
    ["write", "edit"],
    ["patch", "edit"],
    ["bash", "bash"],
    ["read", "read"],
    ["grep", "search"],
    ["glob", "search"],
    ["list", "search"],
    ["webfetch", "web"],
    ["task", "subagent"],
    ["mcp__x__y", "other"],
    ["", "other"],
  ])("maps %s to %s", (name, category) => {
    expect(mapToolNameToCategory(name)).toBe(category);
  });
});
