import { PublicAgentSchema } from "@afteroffice/core";
import { z } from "zod";

export const StoredAgentSchema = z.object({
  agent: PublicAgentSchema,
  lastSeen: z.number(),
});

export type StoredAgent = z.infer<typeof StoredAgentSchema>;
