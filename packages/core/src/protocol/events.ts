import { z } from "zod";
import { RoomIdSchema } from "../rooms/rooms";

export const AGENT_KINDS = ["claude-code", "opencode"] as const;

export const AgentKindSchema = z.enum(AGENT_KINDS);

export type AgentKind = z.infer<typeof AgentKindSchema>;

export const TOOL_CATEGORIES = [
  "edit",
  "bash",
  "read",
  "search",
  "web",
  "subagent",
  "other",
] as const;

export const ToolCategorySchema = z.enum(TOOL_CATEGORIES);

export type ToolCategory = z.infer<typeof ToolCategorySchema>;

export const HandleSchema = z
  .string()
  .min(3)
  .max(32)
  .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/);

export type Handle = z.infer<typeof HandleSchema>;

export const SessionIdSchema = z.string().regex(/^[A-Za-z0-9_-]{16,64}$/);

export type SessionId = z.infer<typeof SessionIdSchema>;

const inRoom = {
  sessionId: SessionIdSchema,
  roomId: RoomIdSchema,
};

export const EnterEventSchema = z.strictObject({
  type: z.literal("enter"),
  sessionId: SessionIdSchema,
  agent: AgentKindSchema,
});

export const WorkEventSchema = z.strictObject({
  type: z.literal("work"),
  ...inRoom,
  tool: ToolCategorySchema,
});

export const WaitingEventSchema = z.strictObject({ type: z.literal("waiting"), ...inRoom });

export const DoneEventSchema = z.strictObject({ type: z.literal("done"), ...inRoom });

export const IdleEventSchema = z.strictObject({ type: z.literal("idle"), ...inRoom });

export const ErrorEventSchema = z.strictObject({ type: z.literal("error"), ...inRoom });

export const LeaveEventSchema = z.strictObject({ type: z.literal("leave"), ...inRoom });

export const HeartbeatEventSchema = z.strictObject({ type: z.literal("heartbeat"), ...inRoom });

export const ClubEventSchema = z.discriminatedUnion("type", [
  EnterEventSchema,
  WorkEventSchema,
  WaitingEventSchema,
  DoneEventSchema,
  IdleEventSchema,
  ErrorEventSchema,
  LeaveEventSchema,
  HeartbeatEventSchema,
]);

export type ClubEvent = z.infer<typeof ClubEventSchema>;

export type ClubEventType = ClubEvent["type"];

export const EnterResponseSchema = z.strictObject({
  roomId: RoomIdSchema,
  vip: z.boolean(),
});

export type EnterResponse = z.infer<typeof EnterResponseSchema>;
