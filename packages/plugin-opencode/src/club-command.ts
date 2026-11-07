import {
  failureText,
  floorSummary,
  join,
  leaveAllSessions,
  readIdentity,
  renameHandle,
  webUrl,
} from "@afteroffice/cli";
import { HandleSchema } from "@afteroffice/core";

const USAGE = "Usage: /afteroffice:club join, name <handle>, whoami, floor or leave-all.";
const NAME_USAGE = "Usage: /afteroffice:club name <handle>.";
const NOT_JOINED = "Not joined yet. Run /afteroffice:club join first.";
const INVALID_HANDLE =
  "Pick a name with 3 to 32 characters: lowercase letters, digits and hyphens.";

function profileUrl(handle: string): string {
  return `${webUrl()}/@${handle}`;
}

async function joinClub(): Promise<string> {
  const identity = await readIdentity();
  if (identity !== undefined) {
    return `Already joined the club as ${identity.handle}.\n${profileUrl(identity.handle)}`;
  }

  const result = await join();
  if (!result.ok) {
    return failureText(result.reason);
  }
  return `Joined the club as ${result.identity.handle}.\n${profileUrl(result.identity.handle)}`;
}

async function rename(argument: string | undefined): Promise<string> {
  if (argument === undefined) {
    return NAME_USAGE;
  }
  if (!HandleSchema.safeParse(argument).success) {
    return INVALID_HANDLE;
  }
  const identity = await readIdentity();
  if (identity === undefined) {
    return NOT_JOINED;
  }
  const result = await renameHandle(identity, argument);
  if (result.ok) {
    return `Renamed to ${result.identity.handle}.\n${profileUrl(result.identity.handle)}`;
  }
  return result.reason === "handle-taken"
    ? "That name is taken. Try another one."
    : failureText(result.reason);
}

async function whoami(): Promise<string> {
  const identity = await readIdentity();
  return identity === undefined ? NOT_JOINED : `${identity.handle}\n${profileUrl(identity.handle)}`;
}

async function floor(): Promise<string> {
  const identity = await readIdentity();
  return identity === undefined ? NOT_JOINED : floorSummary();
}

async function leaveAll(): Promise<string> {
  const identity = await readIdentity();
  if (identity === undefined) {
    return NOT_JOINED;
  }
  const count = await leaveAllSessions(identity);
  return `Left the club with ${count} ${count === 1 ? "session" : "sessions"}.`;
}

export async function runClubCommand(text: string): Promise<string> {
  try {
    const parts = text
      .trim()
      .split(/\s+/)
      .filter((part) => part.length > 0);
    const verb = parts[0] ?? "join";
    if (verb === "join") {
      return await joinClub();
    }
    if (verb === "name") {
      return await rename(parts[1]);
    }
    if (verb === "whoami") {
      return await whoami();
    }
    if (verb === "floor") {
      return await floor();
    }
    if (verb === "leave-all") {
      return await leaveAll();
    }
    return USAGE;
  } catch {
    return "Could not reach the club. Try again later.";
  }
}
