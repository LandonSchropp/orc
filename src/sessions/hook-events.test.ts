import type { AgentState } from "../types.ts";
import { processHookEvent } from "./hook-events.ts";
import { beforeEach, describe, expect, it, mock } from "bun:test";

const writeStateFileMock = mock((): Promise<void> => Promise.resolve());
const readStateFileMock = mock((): Promise<AgentState | null> => Promise.resolve(null));
const sessionIdMock = mock((): Promise<string> => Promise.resolve(""));

await mock.module("./state.ts", () => ({
  writeStateFile: writeStateFileMock,
  readStateFile: readStateFileMock,
}));

await mock.module("../commands/tmux.ts", () => ({
  sessionId: sessionIdMock,
}));

beforeEach(() => {
  sessionIdMock.mockResolvedValue("test-project/feature-a");
  readStateFileMock.mockResolvedValue(null);
});

describe("processHookEvent", () => {
  describe("when the event is UserPromptSubmit", () => {
    it("writes Working status for the firing pane", async () => {
      await processHookEvent({ hook_event_name: "UserPromptSubmit" }, "%5");
      expect(writeStateFileMock).toHaveBeenCalledWith("test-project", "feature-a", "%5", "Working");
    });
  });

  describe("when the event is Stop", () => {
    it("writes Idle status for the firing pane", async () => {
      await processHookEvent({ hook_event_name: "Stop" }, "%5");
      expect(writeStateFileMock).toHaveBeenCalledWith("test-project", "feature-a", "%5", "Idle");
    });
  });

  describe("when the event is Notification", () => {
    describe("when the notification type is permission_prompt", () => {
      it("writes Waiting status for the firing pane", async () => {
        await processHookEvent(
          { hook_event_name: "Notification", notification_type: "permission_prompt" },
          "%5",
        );
        expect(writeStateFileMock).toHaveBeenCalledWith(
          "test-project",
          "feature-a",
          "%5",
          "Waiting",
        );
      });
    });

    describe("when the notification type is elicitation_dialog", () => {
      it("writes Waiting status for the firing pane", async () => {
        await processHookEvent(
          { hook_event_name: "Notification", notification_type: "elicitation_dialog" },
          "%5",
        );
        expect(writeStateFileMock).toHaveBeenCalledWith(
          "test-project",
          "feature-a",
          "%5",
          "Waiting",
        );
      });
    });

    describe("when the notification type is idle_prompt", () => {
      it("does not write a state file", async () => {
        await processHookEvent(
          { hook_event_name: "Notification", notification_type: "idle_prompt" },
          "%5",
        );
        expect(writeStateFileMock).not.toHaveBeenCalled();
      });
    });
  });

  describe("when the event is PostToolUse", () => {
    it("writes Working status for the firing pane", async () => {
      await processHookEvent({ hook_event_name: "PostToolUse" }, "%5");
      expect(writeStateFileMock).toHaveBeenCalledWith("test-project", "feature-a", "%5", "Working");
    });
  });

  describe("when the tmux session id has no slash separator", () => {
    it("does not write a state file", async () => {
      sessionIdMock.mockResolvedValue("foreign-session");
      await processHookEvent({ hook_event_name: "Stop" }, "%5");
      expect(writeStateFileMock).not.toHaveBeenCalled();
    });
  });

  describe("when the firing pane already has the event's status", () => {
    it("does not rewrite the state file", async () => {
      readStateFileMock.mockResolvedValue({
        status: "Working",
        timestamp: "2026-05-24T00:00:00.000Z",
      });

      await processHookEvent({ hook_event_name: "UserPromptSubmit" }, "%5");

      expect(writeStateFileMock).not.toHaveBeenCalled();
    });
  });

  describe("when the firing pane has a different status", () => {
    it("writes the new status", async () => {
      readStateFileMock.mockResolvedValue({
        status: "Idle",
        timestamp: "2026-05-24T00:00:00.000Z",
      });

      await processHookEvent({ hook_event_name: "UserPromptSubmit" }, "%5");

      expect(writeStateFileMock).toHaveBeenCalledWith("test-project", "feature-a", "%5", "Working");
    });
  });
});
