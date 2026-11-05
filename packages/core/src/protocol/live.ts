import { z } from "zod";
import { RoomIdSchema } from "../rooms/rooms";
import { AGENT_STATES } from "../state/agent-state";
import { AgentKindSchema, HandleSchema } from "./events";

export const MAX_BUBBLE_LENGTH = 28;

export const AgentStateSchema = z.enum(AGENT_STATES);

export const PublicAgentIdSchema = z.string().regex(/^[a-z0-9]{12}$/);

export type PublicAgentId = z.infer<typeof PublicAgentIdSchema>;

export const PublicAgentSchema = z.strictObject({
  id: PublicAgentIdSchema,
  handle: HandleSchema,
  agent: AgentKindSchema,
  state: AgentStateSchema,
  vip: z.boolean(),
});

export type PublicAgent = z.infer<typeof PublicAgentSchema>;

const OnlineCountSchema = z.number().int().nonnegative();

export const SnapshotMessageSchema = z.strictObject({
  type: z.literal("snapshot"),
  roomId: RoomIdSchema,
  online: OnlineCountSchema,
  agents: z.array(PublicAgentSchema),
});

export const AgentEnteredMessageSchema = z.strictObject({
  type: z.literal("agent-entered"),
  agent: PublicAgentSchema,
});

export const AgentChangedMessageSchema = z.strictObject({
  type: z.literal("agent-changed"),
  id: PublicAgentIdSchema,
  state: AgentStateSchema,
});

export const AgentLeftMessageSchema = z.strictObject({
  type: z.literal("agent-left"),
  id: PublicAgentIdSchema,
});

export const BubbleMessageSchema = z.strictObject({
  type: z.literal("bubble"),
  id: PublicAgentIdSchema,
  text: z.string().min(1).max(MAX_BUBBLE_LENGTH),
});

export const OnlineMessageSchema = z.strictObject({
  type: z.literal("online"),
  online: OnlineCountSchema,
});

export const LiveMessageSchema = z.discriminatedUnion("type", [
  SnapshotMessageSchema,
  AgentEnteredMessageSchema,
  AgentChangedMessageSchema,
  AgentLeftMessageSchema,
  BubbleMessageSchema,
  OnlineMessageSchema,
]);

export type LiveMessage = z.infer<typeof LiveMessageSchema>;
