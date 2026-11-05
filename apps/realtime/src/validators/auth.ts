import { z } from "zod";

export const BearerHeaderSchema = z
  .string()
  .regex(/^Bearer [A-Za-z0-9_-]{43}$/)
  .transform((value) => value.slice("Bearer ".length));
