import type { ToolCategory } from "@afteroffice/core";

const CATEGORY_BY_TOOL: ReadonlyMap<string, ToolCategory> = new Map([
  ["edit", "edit"],
  ["write", "edit"],
  ["multiedit", "edit"],
  ["notebookedit", "edit"],
  ["patch", "edit"],
  ["bash", "bash"],
  ["read", "read"],
  ["grep", "search"],
  ["glob", "search"],
  ["ls", "search"],
  ["list", "search"],
  ["webfetch", "web"],
  ["websearch", "web"],
  ["task", "subagent"],
  ["agent", "subagent"],
]);

export function mapToolNameToCategory(toolName: string): ToolCategory {
  return CATEGORY_BY_TOOL.get(toolName.toLowerCase()) ?? "other";
}
