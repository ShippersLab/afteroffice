import { randomBytes, randomInt } from "node:crypto";
import {
  type AgentKind,
  HEARTBEAT_INTERVAL_MS,
  type RoomId,
  type SessionId,
  SessionIdSchema,
  TOOL_CATEGORIES,
} from "@afteroffice/core";
import { requestJoin, sendEventAs } from "../../client/http-client";
import type { Identity } from "../../storage/identity-store";
import { type SessionSignal, toClubEvent } from "../../utilities/signal";

const SIGNALS = ["work", "work", "work", "work", "waiting", "idle", "done", "error"] as const;

export type SimulatedAgent = {
  identity: Identity;
  sessionId: SessionId;
  roomId: RoomId;
  agent: AgentKind;
};

function randomSignal(): SessionSignal {
  const type = SIGNALS[randomInt(SIGNALS.length)] ?? "idle";
  if (type === "work") {
    return { type, tool: TOOL_CATEGORIES[randomInt(TOOL_CATEGORIES.length)] ?? "other" };
  }
  return { type };
}

export async function spawnAgent(url: string, index: number): Promise<SimulatedAgent | undefined> {
  const joined = await requestJoin(url);
  if (!joined.ok) {
    return undefined;
  }
  const sessionId = SessionIdSchema.parse(randomBytes(24).toString("base64url"));
  const agent: AgentKind = index % 2 === 0 ? "claude-code" : "opencode";
  const entered = await sendEventAs(joined.identity, { type: "enter", sessionId, agent });
  if (!entered.ok || entered.enter === null) {
    return undefined;
  }
  return { identity: joined.identity, sessionId, roomId: entered.enter.roomId, agent };
}

export function startAgentLoop(agent: SimulatedAgent): () => void {
  let activity: NodeJS.Timeout | undefined;
  const schedule = (): void => {
    activity = setTimeout(
      () => {
        const event = toClubEvent(randomSignal(), agent.sessionId, agent.roomId);
        void sendEventAs(agent.identity, event);
        schedule();
      },
      randomInt(2000, 6000),
    );
  };
  schedule();
  const heartbeat = setInterval(() => {
    void sendEventAs(agent.identity, {
      type: "heartbeat",
      sessionId: agent.sessionId,
      roomId: agent.roomId,
    });
  }, HEARTBEAT_INTERVAL_MS);
  return () => {
    clearTimeout(activity);
    clearInterval(heartbeat);
  };
}

export async function leaveAgent(agent: SimulatedAgent): Promise<void> {
  await sendEventAs(agent.identity, {
    type: "leave",
    sessionId: agent.sessionId,
    roomId: agent.roomId,
  });
}
