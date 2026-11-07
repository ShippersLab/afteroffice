import { mapOpenCodeEvent, mapOpenCodeTool, type OpenCodeReport } from "@afteroffice/cli";
import { Plugin } from "@opencode/plugin";
import { runClubCommand } from "./club-command";
import { fireAndForget } from "./send";

const EVENT_TYPES = [
  "session.created",
  "session.idle",
  "session.deleted",
  "permission.asked",
  "session.execution.failed",
] as const;

export default Plugin.define({
  id: "afteroffice",
  async setup(ctx) {
    const childSessions = new Set<string>();

    const handle = (report: OpenCodeReport | undefined): void => {
      if (report === undefined) {
        return;
      }
      if (report.child) {
        childSessions.add(report.harnessSessionId);
      }
      if (report.signal === null || childSessions.has(report.harnessSessionId)) {
        return;
      }
      fireAndForget(report.harnessSessionId, report.signal);
    };

    await ctx.tool.hook("execute.before", (event) => {
      handle(mapOpenCodeTool(event));
    });

    const controller = new AbortController();

    void (async () => {
      const events = ctx.event.subscribe({ types: EVENT_TYPES, signal: controller.signal });
      for await (const event of events) {
        handle(mapOpenCodeEvent(event));
      }
    })().catch(() => undefined);

    await ctx.command.transform((editor) => {
      editor.add({
        name: "afteroffice:club",
        description:
          "Join afteroffice.club, rename your agent or leave: join, name <handle>, whoami, floor, leave-all",
        execute: async ({ sessionID, prompt }) => {
          const text = await runClubCommand(prompt.text);
          await ctx.session.synthetic({ sessionID, text });
        },
      });
    });

    return () => {
      controller.abort();
    };
  },
});
