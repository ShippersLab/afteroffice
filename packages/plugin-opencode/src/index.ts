import { mapOpenCodeEvent, mapOpenCodeTool, type OpenCodeReport } from "@afteroffice/cli";
import type { Plugin } from "@opencode-ai/plugin";
import { fireAndForget } from "./send";

export const AfterofficePlugin: Plugin = async () => {
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

  return {
    event: async ({ event }) => {
      handle(mapOpenCodeEvent(event));
    },
    "tool.execute.before": async (input) => {
      handle(mapOpenCodeTool(input));
    },
  };
};
