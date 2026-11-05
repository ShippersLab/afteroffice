import { type AgentState, type PublicAgent, type RoomId, RoomIdSchema } from "@afteroffice/core";
import { type StoredAgent, StoredAgentSchema } from "./schema";

const AGENT_PREFIX = "agent:";
const ROOM_KEY = "roomId";

export class AgentStore {
  constructor(private readonly kv: SyncKvStorage) {}

  get(sessionId: string): StoredAgent | null {
    const parsed = StoredAgentSchema.safeParse(this.kv.get(`${AGENT_PREFIX}${sessionId}`));
    return parsed.success ? parsed.data : null;
  }

  private entries(): [string, StoredAgent][] {
    const result: [string, StoredAgent][] = [];
    for (const [key, value] of this.kv.list({ prefix: AGENT_PREFIX })) {
      const parsed = StoredAgentSchema.safeParse(value);
      if (parsed.success) {
        result.push([key.slice(AGENT_PREFIX.length), parsed.data]);
      }
    }
    return result;
  }

  list(): PublicAgent[] {
    return this.entries().map(([, stored]) => stored.agent);
  }

  insert(sessionId: string, agent: PublicAgent, now: number): void {
    this.kv.put(`${AGENT_PREFIX}${sessionId}`, { agent, lastSeen: now });
  }

  update(sessionId: string, stored: StoredAgent, state: AgentState, now: number): void {
    this.kv.put(`${AGENT_PREFIX}${sessionId}`, {
      agent: { ...stored.agent, state },
      lastSeen: now,
    });
  }

  touch(sessionId: string, stored: StoredAgent, now: number): void {
    this.kv.put(`${AGENT_PREFIX}${sessionId}`, { ...stored, lastSeen: now });
  }

  remove(sessionId: string): void {
    this.kv.delete(`${AGENT_PREFIX}${sessionId}`);
  }

  removeExpired(cutoff: number): PublicAgent[] {
    const gone: PublicAgent[] = [];
    for (const [sessionId, stored] of this.entries()) {
      if (stored.lastSeen < cutoff) {
        this.kv.delete(`${AGENT_PREFIX}${sessionId}`);
        gone.push(stored.agent);
      }
    }
    return gone;
  }

  count(): number {
    return this.entries().length;
  }

  oldestSeen(): number | null {
    const seen = this.entries().map(([, stored]) => stored.lastSeen);
    return seen.length === 0 ? null : Math.min(...seen);
  }

  rememberRoom(roomId: RoomId): void {
    this.kv.put(ROOM_KEY, roomId);
  }

  currentRoom(): RoomId | null {
    const parsed = RoomIdSchema.safeParse(this.kv.get(ROOM_KEY));
    return parsed.success ? parsed.data : null;
  }
}
