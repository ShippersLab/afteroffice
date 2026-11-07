import { describe, expect, it } from "vitest";
import { FloorCounts } from "../../durable-objects/directory/storage";
import { AgentStore } from "../../durable-objects/floor/storage";

class MemoryKv implements SyncKvStorage {
  private readonly data = new Map<string, unknown>();
  get<T = unknown>(key: string): T | undefined {
    return this.data.get(key) as T | undefined;
  }
  list<T = unknown>(options?: SyncKvListOptions): Iterable<[string, T]> {
    const prefix = options?.prefix ?? "";
    return [...this.data.entries()].filter(([key]) => key.startsWith(prefix)) as [string, T][];
  }
  put<T>(key: string, value: T): void {
    this.data.set(key, value);
  }
  delete(key: string): boolean {
    return this.data.delete(key);
  }
}

const agent = {
  id: "abcdefghij12",
  handle: "sleepy-otter-42",
  agent: "opencode",
  state: "at-the-bar",
  vip: false,
} as const;

describe("AgentStore", () => {
  it("stores, updates and removes agents", () => {
    const store = new AgentStore(new MemoryKv());
    store.insert("s1", agent, 100);
    expect(store.count()).toBe(1);
    const stored = store.get("s1");
    expect(stored?.agent.handle).toBe("sleepy-otter-42");
    if (stored !== null) {
      store.update("s1", stored, "dancing", 200);
    }
    expect(store.list()[0]?.state).toBe("dancing");
    expect(store.oldestSeen()).toBe(200);
    store.remove("s1");
    expect(store.count()).toBe(0);
    expect(store.oldestSeen()).toBeNull();
  });

  it("removes only expired agents", () => {
    const store = new AgentStore(new MemoryKv());
    store.insert("old", agent, 100);
    store.insert("new", { ...agent, id: "zzzzzzzzzz12" }, 900);
    const gone = store.removeExpired(500);
    expect(gone.map((entry) => entry.id)).toEqual(["abcdefghij12"]);
    expect(store.count()).toBe(1);
  });

  it("remembers the room", () => {
    const store = new AgentStore(new MemoryKv());
    expect(store.currentRoom()).toBeNull();
    store.rememberRoom("floor-2");
    expect(store.currentRoom()).toBe("floor-2");
  });

  it("renames an agent in place and keeps its id", () => {
    const store = new AgentStore(new MemoryKv());
    store.insert("s1", agent, 100);
    const stored = store.get("s1");
    if (stored !== null) {
      store.rename("s1", stored, "new-otter-42", 200);
    }
    const renamed = store.get("s1");
    expect(renamed?.agent.handle).toBe("new-otter-42");
    expect(renamed?.agent.id).toBe("abcdefghij12");
    expect(renamed?.lastSeen).toBe(200);
  });
});

describe("FloorCounts", () => {
  it("increments and overrides counts", () => {
    const counts = new FloorCounts(new MemoryKv());
    counts.increment(1);
    counts.increment(1);
    counts.setForRoom("floor-2", 5);
    expect(counts.list()).toEqual([
      { floor: 1, count: 2 },
      { floor: 2, count: 5 },
    ]);
  });
});
