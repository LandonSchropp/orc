import { switchSession } from "./switch.ts";
import { describe, expect, it, mock } from "bun:test";

const isInsideOrcTmuxSessionMock = mock((): boolean => false);
const switchTmuxSessionMock = mock((): Promise<void> => Promise.resolve());
const attachTmuxSessionMock = mock((): Promise<void> => Promise.resolve());

await mock.module("../commands/tmux.ts", () => ({
  isInsideOrcTmuxSession: isInsideOrcTmuxSessionMock,
  switchTmuxSession: switchTmuxSessionMock,
  attachTmuxSession: attachTmuxSessionMock,
}));

describe("switchSession", () => {
  describe("when inside an orc tmux session", () => {
    it("switches the client to the target session", async () => {
      isInsideOrcTmuxSessionMock.mockReturnValue(true);
      await switchSession("orc", "feature-a");
      expect(switchTmuxSessionMock).toHaveBeenCalledWith("orc:feature-a");
      expect(attachTmuxSessionMock).not.toHaveBeenCalled();
    });
  });

  describe("when not inside an orc tmux session", () => {
    it("attaches the terminal to the target session", async () => {
      isInsideOrcTmuxSessionMock.mockReturnValue(false);
      await switchSession("orc", "feature-a");
      expect(attachTmuxSessionMock).toHaveBeenCalledWith("orc:feature-a");
      expect(switchTmuxSessionMock).not.toHaveBeenCalled();
    });
  });
});
