import type { AgentKind, ClubEvent, RoomId, SessionId, ToolCategory } from "@afteroffice/core";

export type SessionSignal =
  | { type: "enter"; agent: AgentKind }
  | { type: "work"; tool: ToolCategory }
  | { type: "waiting" | "done" | "idle" | "error" | "leave" };

export function toClubEvent(
  signal: SessionSignal,
  sessionId: SessionId,
  roomId: RoomId,
): ClubEvent {
  if (signal.type === "enter") {
    return { type: "enter", sessionId, agent: signal.agent };
  }
  if (signal.type === "work") {
    return { type: "work", sessionId, roomId, tool: signal.tool };
  }
  return { type: signal.type, sessionId, roomId };
}
