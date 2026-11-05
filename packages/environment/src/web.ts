import { createEnv } from "@t3-oss/env-core";
import { z } from "zod";

type RuntimeEnv = Record<string, string | boolean | undefined>;

export const createWebEnvironment = (runtimeEnv: RuntimeEnv) =>
  createEnv({
    clientPrefix: "VITE_",
    client: {
      VITE_REALTIME_URL: z.url().default("http://localhost:8787"),
      VITE_SITE_URL: z.url().default("https://afteroffice.club"),
    },
    runtimeEnv,
    emptyStringAsUndefined: true,
  });

export type WebEnvironment = ReturnType<typeof createWebEnvironment>;
