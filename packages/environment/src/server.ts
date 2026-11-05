import { createEnv } from "@t3-oss/env-core";
import { config } from "dotenv";
import { z } from "zod";
import { ROOT_ENV_FILE } from "./root-env-file";

config({ path: ROOT_ENV_FILE, quiet: true });

export const env = createEnv({
  server: {
    DATABASE_URL: z.string().regex(/^postgres(ql)?:\/\//),
    REALTIME_PORT: z.coerce.number().int().positive().default(8787),
    NODE_ENV: z.enum(["development", "production", "test"]).default("development"),
  },
  runtimeEnv: process.env,
  skipValidation: Boolean(process.env["SKIP_ENV_VALIDATION"]),
  emptyStringAsUndefined: true,
});
