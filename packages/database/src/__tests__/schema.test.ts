import { getTableConfig } from "drizzle-orm/pg-core";
import { describe, expect, it } from "vitest";
import { accounts } from "../schema";

describe("accounts table", () => {
  const config = getTableConfig(accounts);

  it("has row level security enabled", () => {
    expect(config.enableRLS).toBe(true);
  });

  it("is unique on handle and token hash", () => {
    const unique = config.indexes.filter((index) => index.config.unique);
    const names = unique.map((index) => index.config.name).toSorted();
    expect(names).toEqual(["accounts_handle_unique", "accounts_token_hash_unique"]);
  });

  it("stores timestamps with time zone", () => {
    const column = config.columns.find((entry) => entry.name === "created_at");
    expect(column?.getSQLType()).toBe("timestamp with time zone");
  });
});
