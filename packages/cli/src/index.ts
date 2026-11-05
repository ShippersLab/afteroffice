export {
  type Failure,
  type FailureReason,
  type JoinResult,
  join,
  requestJoin,
  type SendResult,
  sendEvent,
  sendEventAs,
} from "./client/http-client";
export {
  CLAUDE_HOOK_EVENTS,
  type ClaudeHookEvent,
  type ClaudeHookReport,
  mapClaudeHook,
} from "./hooks/claude-hook";
export { mapOpenCodeEvent, mapOpenCodeTool, type OpenCodeReport } from "./hooks/opencode-event";
export { mapToolNameToCategory } from "./hooks/tool-category";
export { enterSession, type ReportResult, reportSignal } from "./session/session";
export { deriveSessionId } from "./session/session-id";
export { type Identity, readIdentity } from "./storage/identity-store";
export type { SessionSignal } from "./utilities/signal";
