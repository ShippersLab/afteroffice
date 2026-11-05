import { DurableObject } from "cloudflare:workers";
import {
  AGENT_TIMEOUT_MS,
  type AgentKind,
  type ClubEvent,
  type LiveMessage,
  nextAgentState,
  type PublicAgent,
  type RoomId,
  RoomIdSchema,
} from "@afteroffice/core";
import {
  DIRECTORY_NAME,
  MAX_VIEWERS_PER_FLOOR,
  PING_MESSAGE,
  PONG_MESSAGE,
} from "../../configuration/constants";
import { pickBubble } from "../../services/bubbles";
import { nextAlarmAt } from "../../services/floors";
import { randomPublicId } from "../../utilities/random";
import type { Directory } from "../directory/directory";
import { broadcast } from "./broadcast";
import { AgentStore } from "./storage";

type FloorEnv = { DIRECTORY: DurableObjectNamespace<Directory> };

export class Floor extends DurableObject<FloorEnv> {
  private readonly store: AgentStore;

  constructor(ctx: DurableObjectState, env: FloorEnv) {
    super(ctx, env);
    this.store = new AgentStore(ctx.storage.kv);
    ctx.setWebSocketAutoResponse(new WebSocketRequestResponsePair(PING_MESSAGE, PONG_MESSAGE));
  }

  private directory(): DurableObjectStub<Directory> {
    return this.env.DIRECTORY.getByName(DIRECTORY_NAME);
  }

  private send(message: LiveMessage): void {
    broadcast(this.ctx.getWebSockets(), message);
  }

  private announceState(agent: PublicAgent): void {
    const text = pickBubble(agent.state);
    if (text !== null) {
      this.send({ type: "bubble", id: agent.id, text });
    }
  }

  private async syncOnline(): Promise<void> {
    const roomId = this.store.currentRoom();
    if (roomId === null) {
      return;
    }
    const online = await this.directory().report(roomId, this.store.count());
    this.send({ type: "online", online });
  }

  private async scheduleSweep(): Promise<void> {
    const oldest = this.store.oldestSeen();
    if (oldest === null) {
      return;
    }
    await this.ctx.storage.setAlarm(nextAlarmAt(oldest, Date.now(), AGENT_TIMEOUT_MS));
  }

  async enter(
    roomId: RoomId,
    sessionId: string,
    handle: string,
    agent: AgentKind,
  ): Promise<boolean> {
    this.store.rememberRoom(roomId);
    const now = Date.now();
    const existing = this.store.get(sessionId);
    if (existing !== null && existing.agent.handle !== handle) {
      await this.syncOnline();
      return false;
    }
    if (existing === null) {
      const publicAgent: PublicAgent = {
        id: randomPublicId(),
        handle,
        agent,
        state: "at-the-bar",
        vip: false,
      };
      this.store.insert(sessionId, publicAgent, now);
      this.send({ type: "agent-entered", agent: publicAgent });
    } else {
      this.store.update(sessionId, existing, "at-the-bar", now);
      this.send({ type: "agent-changed", id: existing.agent.id, state: "at-the-bar" });
    }
    await this.syncOnline();
    if ((await this.ctx.storage.getAlarm()) === null) {
      await this.scheduleSweep();
    }
    return true;
  }

  async apply(event: ClubEvent, handle: string): Promise<boolean> {
    const stored = this.store.get(event.sessionId);
    if (stored === null || stored.agent.handle !== handle) {
      return false;
    }
    const now = Date.now();
    if (event.type === "leave") {
      this.store.remove(event.sessionId);
      this.send({ type: "agent-left", id: stored.agent.id });
      await this.syncOnline();
      return true;
    }
    const next = nextAgentState(stored.agent.state, event) ?? stored.agent.state;
    if (next === stored.agent.state) {
      this.store.touch(event.sessionId, stored, now);
      return true;
    }
    this.store.update(event.sessionId, stored, next, now);
    this.send({ type: "agent-changed", id: stored.agent.id, state: next });
    this.announceState({ ...stored.agent, state: next });
    return true;
  }

  override async alarm(): Promise<void> {
    const gone = this.store.removeExpired(Date.now() - AGENT_TIMEOUT_MS);
    for (const agent of gone) {
      this.send({ type: "agent-left", id: agent.id });
    }
    if (gone.length > 0) {
      await this.syncOnline();
    }
    await this.scheduleSweep();
  }

  override async fetch(request: Request): Promise<Response> {
    const parsed = RoomIdSchema.safeParse(new URL(request.url).searchParams.get("roomId"));
    if (!parsed.success) {
      return Response.json({ error: "invalid_room" }, { status: 400 });
    }
    const roomId = parsed.data;
    if (this.ctx.getWebSockets().length >= MAX_VIEWERS_PER_FLOOR) {
      return Response.json({ error: "floor_full" }, { status: 503 });
    }
    this.store.rememberRoom(roomId);
    const online = await this.directory().online();
    const { 0: client, 1: server } = new WebSocketPair();
    this.ctx.acceptWebSocket(server);
    const snapshot: LiveMessage = {
      type: "snapshot",
      roomId,
      online,
      agents: this.store.list(),
    };
    server.send(JSON.stringify(snapshot));
    return new Response(null, { status: 101, webSocket: client });
  }

  override webSocketMessage(socket: WebSocket): void {
    socket.close(1008, "viewers are read only");
  }

  override webSocketClose(socket: WebSocket): void {
    socket.close(1000, "bye");
  }

  override webSocketError(socket: WebSocket): void {
    socket.close(1011, "error");
  }
}
