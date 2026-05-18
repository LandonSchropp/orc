import { processHookEvent } from "./hook-events.ts";
import { beforeEach, describe, expect, it, mock } from "bun:test";

const writeStateFileMock = mock((): Promise<void> => Promise.resolve());
const sessionIdentifierMock = mock((): Promise<string> => Promise.resolve(""));

await mock.module("./state.ts", () => ({
  writeStateFile: writeStateFileMock,
}));

await mock.module("../commands/tmux.ts", () => ({
  sessionIdentifier: sessionIdentifierMock,
}));

beforeEach(() => {
  sessionIdentifierMock.mockResolvedValue("test-project:feature-a");
});

describe("processHookEvent", () => {
  describe("when the event is UserPromptSubmit", () => {
    it("writes Working status for the firing pane", async () => {
      await processHookEvent("UserPromptSubmit", "%5");
      expect(writeStateFileMock).toHaveBeenCalledWith("test-project:feature-a", "%5", "Working");
    });
  });

  describe("when the event is Stop", () => {
    it("writes Idle status for the firing pane", async () => {
      await processHookEvent("Stop", "%5");
      expect(writeStateFileMock).toHaveBeenCalledWith("test-project:feature-a", "%5", "Idle");
    });
  });

  describe("when the event is Notification", () => {
    it("writes Waiting status for the firing pane", async () => {
      await processHookEvent("Notification", "%5");
      expect(writeStateFileMock).toHaveBeenCalledWith("test-project:feature-a", "%5", "Waiting");
    });
  });

  describe("when the event is unknown", () => {
    it("does not write a state file", async () => {
      await processHookEvent("Unrecognized", "%5");
      expect(writeStateFileMock).not.toHaveBeenCalled();
    });
  });
});
