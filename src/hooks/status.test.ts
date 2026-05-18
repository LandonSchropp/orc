import { stubEnv } from "../../test/helpers/env.ts";
import { statusHookCommand } from "./status.ts";
import { beforeEach, describe, expect, it, mock, spyOn } from "bun:test";
import { runCommand } from "citty";

const writeStateFileMock = mock();
const sessionIdentifierMock = mock();
const isInsideOrcTmuxSessionMock = mock();

await mock.module("../sessions/state.ts", () => ({
  writeStateFile: writeStateFileMock,
}));

await mock.module("../commands/tmux.ts", () => ({
  sessionIdentifier: sessionIdentifierMock,
  isInsideOrcTmuxSession: isInsideOrcTmuxSessionMock,
}));

beforeEach(() => {
  stubEnv("TMUX_PANE", "%5");
  isInsideOrcTmuxSessionMock.mockReturnValue(true);
});

describe("statusHookCommand", () => {
  describe("when given a valid payload", () => {
    it("writes the corresponding state for the firing pane", async () => {
      sessionIdentifierMock.mockResolvedValue("test-project/feature-a");
      spyOn(Bun.stdin, "json").mockResolvedValue({ hook_event_name: "Stop" });

      await runCommand(statusHookCommand, { rawArgs: [] });

      expect(writeStateFileMock).toHaveBeenCalledWith("test-project/feature-a", "%5", "Idle");
    });
  });

  describe("when not inside an orc tmux session", () => {
    it("returns silently without writing state", async () => {
      isInsideOrcTmuxSessionMock.mockReturnValue(false);

      await runCommand(statusHookCommand, { rawArgs: [] });

      expect(writeStateFileMock).not.toHaveBeenCalled();
    });
  });

  describe("when TMUX_PANE is not set", () => {
    it("throws an error", () => {
      stubEnv("TMUX_PANE", undefined);
      spyOn(Bun.stdin, "json").mockResolvedValue({ hook_event_name: "Stop" });

      expect(runCommand(statusHookCommand, { rawArgs: [] })).rejects.toThrow(/TMUX_PANE/);
    });
  });

  describe("when the payload is missing hook_event_name", () => {
    it("throws an error", () => {
      spyOn(Bun.stdin, "json").mockResolvedValue({});

      expect(runCommand(statusHookCommand, { rawArgs: [] })).rejects.toThrow(/hook_event_name/);
    });
  });

  describe("when stdin contains malformed JSON", () => {
    it("throws", () => {
      spyOn(Bun.stdin, "json").mockRejectedValue(new SyntaxError("Unexpected token"));

      expect(runCommand(statusHookCommand, { rawArgs: [] })).rejects.toThrow();
    });
  });
});
