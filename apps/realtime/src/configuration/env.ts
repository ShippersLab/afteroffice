import type { Database } from "@afteroffice/database";
import type { Directory } from "../durable-objects/directory/directory";
import type { Floor } from "../durable-objects/floor/floor";

export type Env = {
  HYPERDRIVE: Hyperdrive;
  DIRECTORY: DurableObjectNamespace<Directory>;
  FLOOR: DurableObjectNamespace<Floor>;
  JOIN_LIMITER: RateLimit;
  EVENTS_LIMITER: RateLimit;
  LIVE_LIMITER: RateLimit;
};

export type LimiterName = "JOIN_LIMITER" | "EVENTS_LIMITER" | "LIVE_LIMITER";

export type Variables = {
  getDatabase: () => Database;
  tokenHash: string;
  handle: string;
};

export type AppEnv = { Bindings: Env; Variables: Variables };
