import { readdir, readFile, rm, stat } from "node:fs/promises";
import { join } from "node:path";
import {
  RoomIdSchema,
  type SessionId,
  SessionIdSchema,
  ToolCategorySchema,
} from "@afteroffice/core";
import { z } from "zod";
import { sessionsDir } from "../storage/paths";
import { writePrivateJson } from "../storage/secure-file";

const MAX_SESSION_AGE_MS = 24 * 60 * 60 * 1000;
const JSON_SUFFIX = ".json";

const SessionRecordSchema = z.strictObject({
  roomId: RoomIdSchema,
  lastHeartbeat: z.number().int().nonnegative(),
  lastWorkTool: ToolCategorySchema.optional(),
  lastWorkAt: z.number().int().nonnegative().optional(),
});

export type SessionRecord = z.infer<typeof SessionRecordSchema>;

function sessionPath(sessionId: SessionId): string {
  return join(sessionsDir(), `${sessionId}${JSON_SUFFIX}`);
}

export async function readSession(sessionId: SessionId): Promise<SessionRecord | undefined> {
  try {
    const raw: unknown = JSON.parse(await readFile(sessionPath(sessionId), "utf8"));
    const parsed = SessionRecordSchema.safeParse(raw);
    return parsed.success ? parsed.data : undefined;
  } catch {
    return undefined;
  }
}

export async function writeSession(sessionId: SessionId, record: SessionRecord): Promise<void> {
  await writePrivateJson(sessionPath(sessionId), SessionRecordSchema.parse(record));
}

export async function removeSession(sessionId: SessionId): Promise<void> {
  await rm(sessionPath(sessionId), { force: true });
}

export async function listSessionIds(): Promise<SessionId[]> {
  try {
    const names = await readdir(sessionsDir());
    return names.flatMap((name) => {
      const parsed = SessionIdSchema.safeParse(name.slice(0, -JSON_SUFFIX.length));
      return name.endsWith(JSON_SUFFIX) && parsed.success ? [parsed.data] : [];
    });
  } catch {
    return [];
  }
}

export async function pruneSessions(now: number): Promise<void> {
  const ids = await listSessionIds();
  await Promise.all(
    ids.map(async (id) => {
      try {
        const info = await stat(sessionPath(id));
        if (now - info.mtimeMs > MAX_SESSION_AGE_MS) {
          await removeSession(id);
        }
      } catch {
        return;
      }
    }),
  );
}
