import { HandleSchema } from "@afteroffice/core";
import { z } from "zod";

export const NameRequestSchema = z.strictObject({
  handle: HandleSchema,
});

export type NameRequest = z.infer<typeof NameRequestSchema>;
