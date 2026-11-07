import { accounts, type Database } from "@afteroffice/database";
import { eq } from "drizzle-orm";
import { MAX_HANDLE_ATTEMPTS } from "../configuration/constants";
import { cacheHandle, getCachedHandle } from "./account-cache";
import { generateHandle } from "./handles";

export async function findHandle(db: () => Database, tokenHash: string): Promise<string | null> {
  const cached = getCachedHandle(tokenHash);
  if (cached !== null) {
    return cached;
  }
  const rows = await db()
    .select({ handle: accounts.handle })
    .from(accounts)
    .where(eq(accounts.tokenHash, tokenHash))
    .limit(1);
  const handle = rows[0]?.handle ?? null;
  if (handle !== null) {
    cacheHandle(tokenHash, handle);
  }
  return handle;
}

export async function renameAccount(
  db: () => Database,
  tokenHash: string,
  handle: string,
): Promise<boolean> {
  let rows: { handle: string }[];
  try {
    rows = await db()
      .update(accounts)
      .set({ handle })
      .where(eq(accounts.tokenHash, tokenHash))
      .returning({ handle: accounts.handle });
  } catch {
    return false;
  }
  if (rows[0] === undefined) {
    return false;
  }
  cacheHandle(tokenHash, handle);
  return true;
}

async function insertAccount(
  db: () => Database,
  tokenHash: string,
  attemptsLeft: number,
): Promise<string | null> {
  if (attemptsLeft === 0) {
    return null;
  }
  const rows = await db()
    .insert(accounts)
    .values({ handle: generateHandle(), tokenHash })
    .onConflictDoNothing()
    .returning({ handle: accounts.handle });
  const handle = rows[0]?.handle;
  if (handle === undefined) {
    return insertAccount(db, tokenHash, attemptsLeft - 1);
  }
  cacheHandle(tokenHash, handle);
  return handle;
}

export function createAccount(db: () => Database, tokenHash: string): Promise<string | null> {
  return insertAccount(db, tokenHash, MAX_HANDLE_ATTEMPTS);
}
