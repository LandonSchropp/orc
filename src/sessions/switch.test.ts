import { switchSession } from "./switch.ts";
import { describe, expect, it, mock } from "bun:test";

const isInsideTmuxSessionMock = mock((): boolean => false);
const switchTmuxSessionMock = mock((): Promise<void> => Promise.resolve());
const attachTmuxSessionMock = mock((): Promise<void> => Promise.resolve());

await mock.module("../commands/tmux.ts", () => ({
  isInsideTmuxSession: isInsideTmuxSessionMock,
  switchTmuxSession: switchTmuxSessionMock,
  attachTmuxSession: attachTmuxSessionMock,
}));

describe("switchSession", () => {
  describe("when inside a tmux session", () => {
    it("switches the client to the target session", async () => {
      isInsideTmuxSessionMock.mockReturnValue(true);
      await switchSession("orc", "feature-a");
      expect(switchTmuxSessionMock).toHaveBeenCalledWith("orc:feature-a");
      expect(attachTmuxSessionMock).not.toHaveBeenCalled();
    });
  });

  describe("when not inside a tmux session", () => {
    it("attaches the terminal to the target session", async () => {
      isInsideTmuxSessionMock.mockReturnValue(false);
      await switchSession("orc", "feature-a");
      expect(attachTmuxSessionMock).toHaveBeenCalledWith("orc:feature-a");
      expect(switchTmuxSessionMock).not.toHaveBeenCalled();
    });
  });
});
