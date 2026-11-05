import { z } from "zod";
import type { SessionSignal } from "../utilities/signal";
import { mapToolNameToCategory } from "./tool-category";

const SessionInfoSchema = z.object({
  id: z.string().min(1).max(512),
  parentID: z.string().optional(),
});

const SessionIdPropsSchema = z.object({ sessionID: z.string().min(1).max(512) });

const EventSchema = z.object({ type: z.string().max(64), properties: z.unknown() });

const InfoPropsSchema = z.object({ info: SessionInfoSchema });

const ToolInputSchema = z.object({
  tool: z.string().max(256),
  sessionID: z.string().min(1).max(512),
});

export type OpenCodeReport = {
  harnessSessionId: string;
  signal: SessionSignal | null;
  child: boolean;
};

function fromSessionId(properties: unknown, signal: SessionSignal): OpenCodeReport | undefined {
  const parsed = SessionIdPropsSchema.safeParse(properties);
  return parsed.success
    ? { harnessSessionId: parsed.data.sessionID, signal, child: false }
    : undefined;
}

function fromInfo(properties: unknown, signal: SessionSignal): OpenCodeReport | undefined {
  const parsed = InfoPropsSchema.safeParse(properties);
  if (!parsed.success) {
    return undefined;
  }
  const { id, parentID } = parsed.data.info;
  return { harnessSessionId: id, signal, child: parentID !== undefined };
}

export function mapOpenCodeEvent(event: unknown): OpenCodeReport | undefined {
  const parsed = EventSchema.safeParse(event);
  if (!parsed.success) {
    return undefined;
  }
  const { type, properties } = parsed.data;
  switch (type) {
    case "session.created": {
      const report = fromInfo(properties, { type: "enter", agent: "opencode" });
      return report?.child ? { ...report, signal: null } : report;
    }
    case "session.idle":
      return fromSessionId(properties, { type: "done" });
    case "session.error":
      return fromSessionId(properties, { type: "error" });
    case "session.deleted":
      return fromInfo(properties, { type: "leave" });
    case "permission.asked":
    case "permission.updated":
      return fromSessionId(properties, { type: "waiting" });
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
