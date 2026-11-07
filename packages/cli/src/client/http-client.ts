import {
  type ClubEvent,
  ClubEventSchema,
  type EnterResponse,
  EnterResponseSchema,
  HandleSchema,
} from "@afteroffice/core";
import { z } from "zod";
import { type Identity, readIdentity, writeIdentity } from "../storage/identity-store";
import { apiUrl } from "../storage/paths";

export const REQUEST_TIMEOUT_MS = 1500;

export type FailureReason =
  | "network"
  | "http"
  | "no-identity"
  | "invalid-response"
  | "invalid-event"
  | "invalid-handle"
  | "handle-taken";

export type Failure = { ok: false; reason: FailureReason; status: number | null };

export type JoinResult = { ok: true; identity: Identity } | Failure;

export type RenameResult = { ok: true; identity: Identity } | Failure;

export type SendResult = { ok: true; enter: EnterResponse | null } | Failure;

const JoinResponseSchema = z.object({
  handle: HandleSchema,
  token: z.string().min(16).max(256),
});

const RenameResponseSchema = z.object({ handle: HandleSchema });

type PostResult = { ok: true; status: number; body: unknown } | Failure;

async function post(url: string, path: string, body: unknown, token?: string): Promise<PostResult> {
  try {
    const response = await fetch(`${url}${path}`, {
      method: "POST",
      headers: {
        "content-type": "application/json",
        ...(token === undefined ? {} : { authorization: `Bearer ${token}` }),
      },
      body: JSON.stringify(body),
      signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS),
    });
    if (!response.ok) {
      return { ok: false, reason: "http", status: response.status };
    }
    const text = await response.text();
    const parsed: unknown = text.length > 0 ? JSON.parse(text) : null;
    return { ok: true, status: response.status, body: parsed };
  } catch {
    return { ok: false, reason: "network", status: null };
  }
}

export async function requestJoin(url: string = apiUrl()): Promise<JoinResult> {
  const result = await post(url, "/v1/join", {});
  if (!result.ok) {
    return result;
  }
  const parsed = JoinResponseSchema.safeParse(result.body);
  if (!parsed.success) {
    return { ok: false, reason: "invalid-response", status: result.status };
  }
  return { ok: true, identity: { ...parsed.data, url } };
}

export async function join(): Promise<JoinResult> {
  const result = await requestJoin();
  if (result.ok) {
    await writeIdentity(result.identity);
  }
  return result;
}

export async function renameHandle(identity: Identity, handle: string): Promise<RenameResult> {
  const checked = HandleSchema.safeParse(handle);
  if (!checked.success) {
    return { ok: false, reason: "invalid-handle", status: null };
  }
  const result = await post(identity.url, "/v1/name", { handle: checked.data }, identity.token);
  if (!result.ok) {
    return result.status === 409 ? { ok: false, reason: "handle-taken", status: 409 } : result;
  }
  const parsed = RenameResponseSchema.safeParse(result.body);
  if (!parsed.success) {
    return { ok: false, reason: "invalid-response", status: result.status };
  }
  const updated: Identity = { ...identity, handle: parsed.data.handle };
  await writeIdentity(updated);
  return { ok: true, identity: updated };
}

export async function sendEventAs(identity: Identity, event: ClubEvent): Promise<SendResult> {
  const checked = ClubEventSchema.safeParse(event);
  if (!checked.success) {
    return { ok: false, reason: "invalid-event", status: null };
  }
  const result = await post(identity.url, "/v1/events", checked.data, identity.token);
  if (!result.ok) {
    return result;
  }
  if (checked.data.type !== "enter") {
    return { ok: true, enter: null };
  }
  const enter = EnterResponseSchema.safeParse(result.body);
  if (!enter.success) {
    return { ok: false, reason: "invalid-response", status: result.status };
  }
  return { ok: true, enter: enter.data };
}

export async function sendEvent(event: ClubEvent): Promise<SendResult> {
  const identity = await readIdentity();
  if (identity === undefined) {
    return { ok: false, reason: "no-identity", status: null };
  }
  return sendEventAs(identity, event);
}
