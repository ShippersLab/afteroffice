import type { ClubEvent, ToolCategory } from "../protocol/events";

export const AGENT_STATES = [
  "dancing",
  "dj-booth",
  "at-the-bar",
  "asleep-on-the-sofa",
  "stuck-at-the-door",
  "spilled-drink",
] as const;

export type AgentState = (typeof AGENT_STATES)[number];

export function stateForTool(tool: ToolCategory): AgentState {
  switch (tool) {
    case "bash":
      return "dj-booth";
    case "edit":
    case "read":
    case "search":
    case "web":
    case "subagent":
    case "other":
      return "dancing";
    default: {
      const unhandled: never = tool;
      throw new Error(`Unhandled tool category: ${String(unhandled)}`);
    }
  }
}

export function nextAgentState(current: AgentState | null, event: ClubEvent): AgentState | null {
  switch (event.type) {
    case "enter":
      return "at-the-bar";
    case "work":
      return stateForTool(event.tool);
    case "waiting":
      return "stuck-at-the-door";
    case "done":
      return "at-the-bar";
    case "idle":
      return "asleep-on-the-sofa";
    case "error":
      return "spilled-drink";
    case "leave":
      return null;
    case "heartbeat":
      return current;
    default: {
      const unhandled: never = event;
      throw new Error(`Unhandled club event: ${JSON.stringify(unhandled)}`);
    }
  }
}
