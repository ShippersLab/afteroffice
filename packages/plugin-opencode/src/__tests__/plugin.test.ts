import type * as Cli from "@afteroffice/cli";
import { beforeEach, describe, expect, it, vi } from "vitest";

const reported: Array<{ id: string; type: string; tool?: string }> = [];

vi.mock("@afteroffice/cli", async (importOriginal) => {
  const actual = await importOriginal<typeof Cli>();
  return {
    ...actual,
    reportSignal: async (id: string, _agent: string, signal: { type: string; tool?: string }) => {
      reported.push({ id, ...signal });
      throw new Error("boom");
    },
  };
});

import { AfterofficePlugin } from "../index";

type Hooks = Awaited<ReturnType<typeof AfterofficePlugin>>;

async function load(): Promise<Hooks> {
  return AfterofficePlugin({} as Parameters<typeof AfterofficePlugin>[0]);
}

beforeEach(() => {
  reported.length = 0;
});

describe("AfterofficePlugin", () => {
  it("reports events and tools without leaking arguments and never throws", async () => {
    const hooks = await load();
    const input = { tool: "bash", sessionID: "s1", callID: "c" };
    await hooks["tool.execute.before"]?.(input, { args: { command: "cat /etc/passwd" } });
    await hooks.event?.({
      event: { type: "session.idle", data: { sessionID: "s1" } } as never,
    });
    await new Promise((resolve) => setTimeout(resolve, 0));
    expect(reported).toEqual([
      { id: "s1", type: "work", tool: "bash" },
      { id: "s1", type: "done" },
    ]);
  });

  it("ignores child sessions", async () => {
    const hooks = await load();
    await hooks.event?.({
      event: {
        type: "session.created",
        data: { sessionID: "kid", parentID: "p" },
      } as never,
    });
    await hooks["tool.execute.before"]?.(
      { tool: "read", sessionID: "kid", callID: "c" },
      { args: {} },
    );
    expect(reported).toEqual([]);
  });

  it("ignores garbage input", async () => {
    const hooks = await load();
    await hooks.event?.({ event: 42 as never });
    await hooks["tool.execute.before"]?.({} as never, { args: {} });
    expect(reported).toEqual([]);
  });
});
