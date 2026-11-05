import { RoomIdSchema } from "@afteroffice/core";
import { z } from "zod";

export const LiveQuerySchema = z.object({
  roomId: RoomIdSchema.optional(),
});

export type LiveQuery = z.infer<typeof LiveQuerySchema>;
