import type * as Cli from "@afteroffice/cli";
import { beforeEach, describe, expect, it, vi } from "vitest";

type Identity = { handle: string; token: string; url: string };
type Failure = { ok: false; reason: string; status: number | null };
type JoinResult = { ok: true; identity: Identity } | Failure;
type RenameResult = { ok: true; identity: Identity } | Failure;
type Report = { id: string; type: string; tool?: string };

const DEFAULT_IDENTITY: Identity = {
  handle: "sleepy-otter-42",
  token: "0123456789abcdef",
  url: "http://localhost:8787",
};

const state = vi.hoisted(() => ({
  reported: [] as Report[],
  identity: undefined as Identity | undefined,
  joinResult: {
    ok: true,
    identity: { handle: "sleepy-otter-42", token: "0123456789abcdef", url: "http://x" },
  } as JoinResult,
  renameResult: undefined as RenameResult | undefined,
  leaveCount: 0,
}));

vi.mock("@afteroffice/cli", async (importOriginal) => {
  const actual = await importOriginal<typeof Cli>();
  return {
    ...actual,
    reportSignal: async (
      id: string,
      _agent: string,
      signal: { type: string; tool?: string },
    ): Promise<void> => {
      state.reported.push({ id, ...signal });
    },
    join: async (): Promise<JoinResult> => state.joinResult,
    readIdentity: async (): Promise<Identity | undefined> => state.identity,
    renameHandle: async (identity: Identity, handle: string): Promise<RenameResult> =>
      state.renameResult ?? {
        ok: true,
        identity: { ...identity, handle },
      },
    leaveAllSessions: async (): Promise<number> => state.leaveCount,
    floorSummary: async (): Promise<string> =>
      "You are on floor-7 (1 session)\nWatch the club: https://afteroffice.club",
    webUrl: (): string => "https://afteroffice.club",
  };
});

import { runClubCommand } from "../club-command";
import AfterofficePlugin from "../index";

type CommandInvocation = {
  sessionID: string;
  prompt: { text: string };
  delivery: unknown;
};

type CommandDefinition = {
  name: string;
  description?: string;
  execute: (input: CommandInvocation) => Promise<void>;
};

type Harness = {
  toolHook?: (event: unknown) => void;
  command?: CommandDefinition;
  synthetic: ReturnType<typeof vi.fn>;
  signal?: AbortSignal;
  cleanup?: (() => Promise<void> | void) | void;
};

async function flush(): Promise<void> {
  await new Promise((resolve) => setTimeout(resolve, 0));
}

async function createHarness(events: ReadonlyArray<unknown>): Promise<Harness> {
  const harness: Harness = { synthetic: vi.fn<() => Promise<void>>(async () => undefined) };
  const ctx = {
    tool: {
      hook: async (_name: string, callback: (event: unknown) => void) => {
        harness.toolHook = callback;
        return { dispose: async () => undefined };
      },
    },
    event: {
      subscribe: (options: { types: ReadonlyArray<string>; signal?: AbortSignal }) => {
        if (options.signal !== undefined) {
          harness.signal = options.signal;
        }
        return (async function* () {
          for (const event of events) {
            yield event;
          }
        })();
      },
    },
    command: {
      transform: async (
        callback: (editor: { add: (definition: CommandDefinition) => void }) => void,
      ) => {
        callback({
          add: (definition) => {
            harness.command = definition;
          },
        });
        return { dispose: async () => undefined };
      },
    },
    session: {
      synthetic: harness.synthetic,
    },
  };
  harness.cleanup = await AfterofficePlugin.setup(
    ctx as unknown as Parameters<typeof AfterofficePlugin.setup>[0],
  );
  return harness;
}

async function executeCommand(harness: Harness, text: string): Promise<void> {
  const command = harness.command;
  if (command === undefined) {
    throw new Error("command not registered");
  }
  await command.execute({ sessionID: "s1", prompt: { text }, delivery: {} });
}

beforeEach(() => {
  state.reported.length = 0;
  state.identity = undefined;
  state.joinResult = { ok: true, identity: DEFAULT_IDENTITY };
  state.renameResult = undefined;
  state.leaveCount = 0;
});

describe("AfterofficePlugin", () => {
  it("reports tool calls as work", async () => {
    const harness = await createHarness([]);
    harness.toolHook?.({ tool: "bash", sessionID: "s1" });
    expect(state.reported).toEqual([{ id: "s1", type: "work", tool: "bash" }]);
  });

  it("reports an idle session as done", async () => {
    await createHarness([{ type: "session.idle", data: { sessionID: "s1" } }]);
    await flush();
    expect(state.reported).toEqual([{ id: "s1", type: "done" }]);
  });

  it("suppresses child sessions", async () => {
    const harness = await createHarness([
      { type: "session.created", data: { sessionID: "kid", parentID: "parent" } },
    ]);
    await flush();
    harness.toolHook?.({ tool: "read", sessionID: "kid" });
    expect(state.reported).toEqual([]);
  });

  it("ignores garbage input", async () => {
    const harness = await createHarness([42, { type: "session.created", data: {} }]);
    await flush();
    harness.toolHook?.({});
    expect(state.reported).toEqual([]);
  });

  it("registers the command under the afteroffice:club name", async () => {
    const harness = await createHarness([]);
    expect(harness.command?.name).toBe("afteroffice:club");
  });

  it("reports a join from the command", async () => {
    const harness = await createHarness([]);
    await executeCommand(harness, "join");
    expect(harness.synthetic).toHaveBeenCalledWith({
      sessionID: "s1",
      text: "Joined the club as sleepy-otter-42.\nhttps://afteroffice.club",
    });
  });

  it("reports a taken name from the command", async () => {
    state.identity = DEFAULT_IDENTITY;
    state.renameResult = { ok: false, reason: "handle-taken", status: 409 };
    const harness = await createHarness([]);
    await executeCommand(harness, "name taken-name");
    expect(harness.synthetic).toHaveBeenCalledWith({
      sessionID: "s1",
      text: "That name is taken. Try another one.",
    });
  });

  it("reports usage for an unknown subcommand", async () => {
    const harness = await createHarness([]);
    await executeCommand(harness, "dance");
    expect(harness.synthetic).toHaveBeenCalledWith({
      sessionID: "s1",
      text: "Usage: /afteroffice:club join, name <handle>, whoami, floor or leave.",
    });
  });

  it("returns a cleanup that aborts the subscription", async () => {
    const harness = await createHarness([]);
    expect(typeof harness.cleanup).toBe("function");
    expect(() => harness.cleanup?.()).not.toThrow();
    expect(harness.signal?.aborted).toBe(true);
  });
});

describe("runClubCommand", () => {
  it("reports whoami for a joined agent", async () => {
    state.identity = DEFAULT_IDENTITY;
    await expect(runClubCommand("whoami")).resolves.toBe(
      "sleepy-otter-42\nhttps://afteroffice.club",
    );
  });

  it("reports whoami for an agent that did not join", async () => {
    await expect(runClubCommand("whoami")).resolves.toBe(
      "Not joined yet. Run /afteroffice:club join first.",
    );
  });

  it("reports the sessions left", async () => {
    state.identity = DEFAULT_IDENTITY;
    state.leaveCount = 3;
    await expect(runClubCommand("leave")).resolves.toBe("Left the club with 3 sessions.");
  });

  it("uses the singular for one session", async () => {
    state.identity = DEFAULT_IDENTITY;
    state.leaveCount = 1;
    await expect(runClubCommand("leave")).resolves.toBe("Left the club with 1 session.");
  });

  it("reports the floor for a joined agent", async () => {
    state.identity = DEFAULT_IDENTITY;
    await expect(runClubCommand("floor")).resolves.toBe(
      "You are on floor-7 (1 session)\nWatch the club: https://afteroffice.club",
    );
  });

  it("asks the agent to join before reporting the floor", async () => {
    await expect(runClubCommand("floor")).resolves.toBe(
      "Not joined yet. Run /afteroffice:club join first.",
    );
  });

  it("asks for a handle when the name argument is missing", async () => {
    await expect(runClubCommand("name")).resolves.toBe("Usage: /afteroffice:club name <handle>.");
  });

  it("rejects an invalid handle before reading the identity", async () => {
    await expect(runClubCommand("name Bad_Name")).resolves.toBe(
      "Pick a name with 3 to 32 characters: lowercase letters, digits and hyphens.",
    );
  });

  it("asks the agent to join before renaming", async () => {
    await expect(runClubCommand("name fresh-name")).resolves.toBe(
      "Not joined yet. Run /afteroffice:club join first.",
    );
  });

  it("joins by default when the text is empty", async () => {
    await expect(runClubCommand("")).resolves.toBe(
      "Joined the club as sleepy-otter-42.\nhttps://afteroffice.club",
    );
  });
});
