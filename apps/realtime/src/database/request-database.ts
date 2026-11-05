import { createDatabase, type Database } from "@afteroffice/database";
import type { Env } from "../configuration/env";

export type RequestDatabase = {
  get: () => Database;
  close: () => Promise<void>;
};

export function createRequestDatabase(env: Env): RequestDatabase {
  const opened: Database[] = [];
  return {
    get() {
      const existing = opened[0];
      if (existing !== undefined) {
        return existing;
      }
      const created = createDatabase(env.HYPERDRIVE.connectionString);
      opened.push(created);
      return created;
    },
    async close() {
      await Promise.all(opened.map((db) => db.$client.end()));
    },
  };
}
