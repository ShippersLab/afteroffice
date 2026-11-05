import { type AgentKind, HEARTBEAT_INTERVAL_MS, type SessionId } from "@afteroffice/core";
import { type SendResult, sendEventAs } from "../client/http-client";
import { type Identity, readIdentity } from "../storage/identity-store";
import { type SessionSignal, toClubEvent } from "../utilities/signal";
import { deriveSessionId } from "./session-id";
import {
  pruneSessions,
  readSession,
  removeSession,
  type SessionRecord,
  writeSession,
} from "./session-store";

const CONFLICT_STATUS = 409;
const WORK_THROTTLE_MS = 10_000;

export type ReportResult = { ok: true } | { ok: false; reason: "no-identity" | "failed" };

export async function enterSession(
  identity: Identity,
  sessionId: SessionId,
  agent: AgentKind,
): Promise<SessionRecord | undefined> {
  const result = await sendEventAs(identity, { type: "enter", sessionId, agent });
  if (!result.ok || result.enter === null) {
    return undefined;
  }
  const now = Date.now();
  await writeSession(sessionId, { roomId: result.enter.roomId, lastHeartbeat: now });
  await pruneSessions(now);
  return { roomId: result.enter.roomId, lastHeartbeat: now };
}

async function dropOnConflict(sessionId: SessionId, result: SendResult): Promise<void> {
  if (!result.ok && result.status === CONFLICT_STATUS) {
    await removeSession(sessionId);
  }
}

function isThrottled(session: SessionRecord, signal: SessionSignal, now: number): boolean {
  return (
    signal.type === "work" &&
    session.lastWorkTool === signal.tool &&
    session.lastWorkAt !== undefined &&
    now - session.lastWorkAt < WORK_THROTTLE_MS
  );
}

function nextRecord(
  session: SessionRecord,
  signal: SessionSignal,
  now: number,
  sent: boolean,
  heartbeatSent: boolean,
): SessionRecord {
  const base = {
    roomId: session.roomId,
    lastHeartbeat: heartbeatSent ? now : session.lastHeartbeat,
  };
  if (!sent) {
    return { ...base, lastWorkTool: session.lastWorkTool, lastWorkAt: session.lastWorkAt };
  }
  return signal.type === "work" ? { ...base, lastWorkTool: signal.tool, lastWorkAt: now } : base;
}

async function sendInRoom(
  identity: Identity,
  sessionId: SessionId,
  session: SessionRecord,
  signal: SessionSignal,
): Promise<boolean> {
  const now = Date.now();
  const throttled = isThrottled(session, signal, now);
  const heartbeatDue =
    signal.type !== "leave" && now - session.lastHeartbeat > HEARTBEAT_INTERVAL_MS;
  const [main, heartbeat] = await Promise.all([
    throttled
      ? Promise.resolve(null)
      : sendEventAs(identity, toClubEvent(signal, sessionId, session.roomId)),
    heartbeatDue
      ? sendEventAs(identity, { type: "heartbeat", sessionId, roomId: session.roomId })
      : Promise.resolve(null),
  ]);
  if (signal.type === "leave") {
    if (main !== null) {
      await dropOnConflict(sessionId, main);
    }
    await removeSession(sessionId);
    return main?.ok ?? true;
  }
  if (main?.ok || heartbeat?.ok) {
    await writeSession(
      sessionId,
      nextRecord(session, signal, now, main?.ok === true, heartbeat?.ok === true),
    );
  }
  if (main !== null) {
    await dropOnConflict(sessionId, main);
  }
  return main?.ok ?? true;
}

async function refreshSession(
  identity: Identity,
  sessionId: SessionId,
  session: SessionRecord,
): Promise<boolean> {
  const result = await sendEventAs(identity, {
    type: "heartbeat",
    sessionId,
    roomId: session.roomId,
  });
  if (result.ok) {
    await writeSession(sessionId, { ...session, lastHeartbeat: Date.now() });
  }
  await dropOnConflict(sessionId, result);
  return result.ok;
}

async function deliver(
  identity: Identity,
  sessionId: SessionId,
  agent: AgentKind,
  existing: SessionRecord | undefined,
  signal: SessionSignal,
): Promise<boolean> {
  if (signal.type === "leave") {
    return existing === undefined ? true : sendInRoom(identity, sessionId, existing, signal);
  }
  if (existing !== undefined) {
    return signal.type === "enter"
      ? refreshSession(identity, sessionId, existing)
      : sendInRoom(identity, sessionId, existing, signal);
  }
  const entered = await enterSession(identity, sessionId, agent);
  if (entered === undefined) {
    return false;
  }
  return signal.type === "enter" ? true : sendInRoom(identity, sessionId, entered, signal);
}

export async function reportSignal(
  harnessSessionId: string,
  agent: AgentKind,
  signal: SessionSignal,
): Promise<ReportResult> {
  const identity = await readIdentity();
  if (identity === undefined) {
    return { ok: false, reason: "no-identity" };
  }
  const sessionId = deriveSessionId(harnessSessionId);
  const existing = await readSession(sessionId);
  const delivered = await deliver(identity, sessionId, agent, existing, signal);
  return delivered ? { ok: true } : { ok: false, reason: "failed" };
}
