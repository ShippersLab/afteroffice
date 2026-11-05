import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "./schema";

const MAX_CONNECTIONS = 5;

export function createDatabase(connectionString: string) {
  const client = postgres(connectionString, {
    max: MAX_CONNECTIONS,
    fetch_types: false,
  });
  return drizzle({ client, schema });
}

export type Database = ReturnType<typeof createDatabase>;
