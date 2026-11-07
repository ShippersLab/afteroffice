import { ClubEventSchema } from "@afteroffice/core";
import { describe, expect, it } from "vitest";
import { mapOpenCodeEvent, mapOpenCodeTool } from "../../hooks/opencode-event";
import { deriveSessionId } from "../../session/session-id";
import { toClubEvent } from "../../utilities/signal";

function toEvent(report: ReturnType<typeof mapOpenCodeEvent>) {
  if (report?.signal === null || report === undefined) {
    throw new Error("no signal");
  }
  return toClubEvent(report.signal, deriveSessionId(report.harnessSessionId), "floor-1");
}

describe("mapOpenCodeEvent", () => {
  it("maps session events", () => {
    const created = {
      sessionID: "ses_1",
      title: "private title",
      directory: "/home/me/repo",
    };
    expect(toEvent(mapOpenCodeEvent({ type: "session.created", data: created })).type).toBe(
      "enter",
    );
    expect(toEvent(mapOpenCodeEvent({ type: "session.idle", data: { sessionID: "s" } })).type).toBe(
      "done",
    );
    expect(
      toEvent(
        mapOpenCodeEvent({
          type: "session.execution.failed",
          data: { sessionID: "s", error: { message: "/x" } },
        }),
      ).type,
    ).toBe("error");
    expect(
      toEvent(mapOpenCodeEvent({ type: "session.deleted", data: { sessionID: "s" } })).type,
    ).toBe("leave");
    expect(
      toEvent(
        mapOpenCodeEvent({
          type: "permission.asked",
          data: { sessionID: "s", pattern: "rm -rf /" },
        }),
      ).type,
    ).toBe("waiting");
  });

  it("flags child sessions and skips their enter", () => {
    const report = mapOpenCodeEvent({
      type: "session.created",
      data: { sessionID: "child", parentID: "parent" },
    });
    expect(report).toMatchObject({ harnessSessionId: "child", child: true, signal: null });
  });

  it("ignores unknown or malformed events", () => {
    expect(mapOpenCodeEvent({ type: "file.edited", data: { file: "/a" } })).toBeUndefined();
    expect(mapOpenCodeEvent({ type: "session.idle", data: {} })).toBeUndefined();
    expect(
      mapOpenCodeEvent({ type: "session.idle", properties: { sessionID: "s" } }),
    ).toBeUndefined();
    expect(mapOpenCodeEvent("nope")).toBeUndefined();
  });

  it("sends only the tool category for tool calls", () => {
    const report = mapOpenCodeTool({
      tool: "edit",
      sessionID: "ses_9",
      callID: "c",
      args: { filePath: "/home/me/secret.ts" },
    });
    const event = toEvent(report);
    expect(ClubEventSchema.safeParse(event).success).toBe(true);
    expect(event).toMatchObject({ type: "work", tool: "edit" });
    expect(JSON.stringify(event)).not.toMatch(/secret|home|ses_9/);
  });
});
