import { exitSpy, stderrSpy } from "../../test/helpers/process.ts";
import { detachCommand } from "./detach.ts";
import { describe, expect, it, mock } from "bun:test";
import { runCommand } from "citty";

const isInsideTmuxSessionMock = mock((): boolean => false);
const detachTmuxClientMock = mock((): Promise<void> => Promise.resolve());

await mock.module("../commands/tmux.ts", () => ({
  isInsideTmuxSession: isInsideTmuxSessionMock,
  detachTmuxClient: detachTmuxClientMock,
}));

describe("detachCommand", () => {
  describe("when attached to an Orc session", () => {
    it("detaches the current tmux client", async () => {
      isInsideTmuxSessionMock.mockReturnValue(true);
      await runCommand(detachCommand, { rawArgs: [] });
      expect(detachTmuxClientMock).toHaveBeenCalled();
    });
  });

  describe("when not attached to an Orc session", () => {
    it("prints an error and exits with code 1", async () => {
      isInsideTmuxSessionMock.mockReturnValue(false);
      await runCommand(detachCommand, { rawArgs: [] });
      expect(stderrSpy).toHaveBeenCalledWith("Not currently attached to an Orc session\n");
      expect(exitSpy).toHaveBeenCalledWith(1);
      expect(detachTmuxClientMock).not.toHaveBeenCalled();
    });
  });
});
