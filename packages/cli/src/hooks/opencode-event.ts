import { z } from "zod";
import type { SessionSignal } from "../utilities/signal";
import { mapToolNameToCategory } from "./tool-category";

const SessionIdDataSchema = z.object({ sessionID: z.string().min(1).max(512) });

const CreatedDataSchema = z.object({
  sessionID: z.string().min(1).max(512),
  parentID: z.string().optional(),
});

const EventSchema = z.object({ type: z.string().max(64), data: z.unknown() });

const ToolInputSchema = z.object({
  tool: z.string().max(256),
  sessionID: z.string().min(1).max(512),
});

export type OpenCodeReport = {
  harnessSessionId: string;
  signal: SessionSignal | null;
  child: boolean;
};

function fromSessionId(data: unknown, signal: SessionSignal): OpenCodeReport | undefined {
  const parsed = SessionIdDataSchema.safeParse(data);
  return parsed.success
    ? { harnessSessionId: parsed.data.sessionID, signal, child: false }
    : undefined;
}

function fromCreated(data: unknown): OpenCodeReport | undefined {
  const parsed = CreatedDataSchema.safeParse(data);
  if (!parsed.success) {
    return undefined;
  }
  const child = parsed.data.parentID !== undefined;
  return {
    harnessSessionId: parsed.data.sessionID,
    signal: child ? null : { type: "enter", agent: "opencode" },
    child,
  };
}

export function mapOpenCodeEvent(event: unknown): OpenCodeReport | undefined {
  const parsed = EventSchema.safeParse(event);
  if (!parsed.success) {
    return undefined;
  }
  const { type, data } = parsed.data;
  switch (type) {
    case "session.created":
      return fromCreated(data);
    case "session.idle":
      return fromSessionId(data, { type: "done" });
    case "session.deleted":
      return fromSessionId(data, { type: "leave" });
    case "permission.asked":
      return fromSessionId(data, { type: "waiting" });
    case "session.execution.failed":
      return fromSessionId(data, { type: "error" });
    default:
      return undefined;
  }
}

export function mapOpenCodeTool(input: unknown): OpenCodeReport | undefined {
  const parsed = ToolInputSchema.safeParse(input);
  if (!parsed.success) {
    return undefined;
  }
  return {
    harnessSessionId: parsed.data.sessionID,
    signal: { type: "work", tool: mapToolNameToCategory(parsed.data.tool) },
    child: false,
  };
}
