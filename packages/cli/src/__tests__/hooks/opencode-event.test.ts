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
    const info = { id: "ses_1", title: "private title", directory: "/home/me/repo" };
    expect(toEvent(mapOpenCodeEvent({ type: "session.created", properties: { info } })).type).toBe(
      "enter",
    );
    expect(
      toEvent(mapOpenCodeEvent({ type: "session.idle", properties: { sessionID: "s" } })).type,
    ).toBe("done");
    expect(
      toEvent(
        mapOpenCodeEvent({
          type: "session.error",
          properties: { sessionID: "s", error: { message: "/x" } },
        }),
      ).type,
    ).toBe("error");
    expect(toEvent(mapOpenCodeEvent({ type: "session.deleted", properties: { info } })).type).toBe(
      "leave",
    );
    expect(
      toEvent(
        mapOpenCodeEvent({
          type: "permission.asked",
          properties: { sessionID: "s", pattern: "rm -rf /" },
        }),
      ).type,
    ).toBe("waiting");
  });

  it("flags child sessions and skips their enter", () => {
    const report = mapOpenCodeEvent({
      type: "session.created",
      properties: { info: { id: "child", parentID: "parent" } },
    });
    expect(report).toMatchObject({ child: true, signal: null });
  });

  it("ignores unknown or malformed events", () => {
    expect(mapOpenCodeEvent({ type: "file.edited", properties: { file: "/a" } })).toBeUndefined();
    expect(mapOpenCodeEvent({ type: "session.idle", properties: {} })).toBeUndefined();
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
