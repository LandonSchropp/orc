import { stubEnv } from "../../test/helpers/env.ts";
import {
  CONTROL_SESSION,
  attachOrSwitchToControlSession,
  shouldRenderTui,
} from "./control-session.ts";
import { beforeEach, describe, expect, it, mock } from "bun:test";

const createTmuxSessionUnlessExistsMock = mock((): Promise<void> => Promise.resolve());
const switchTmuxSessionMock = mock((): Promise<void> => Promise.resolve());
const attachTmuxSessionMock = mock((): Promise<void> => Promise.resolve());
const isInsideOrcTmuxSessionMock = mock((): boolean => false);
const hasTmuxSessionMock = mock((): Promise<boolean> => Promise.resolve(false));
const isTmuxSessionDeadMock = mock((): Promise<boolean> => Promise.resolve(false));
const killTmuxSessionMock = mock((): Promise<void> => Promise.resolve());

await mock.module("../commands/tmux.ts", () => ({
  createTmuxSessionUnlessExists: createTmuxSessionUnlessExistsMock,
  switchTmuxSession: switchTmuxSessionMock,
  attachTmuxSession: attachTmuxSessionMock,
  isInsideOrcTmuxSession: isInsideOrcTmuxSessionMock,
  hasTmuxSession: hasTmuxSessionMock,
  isTmuxSessionDead: isTmuxSessionDeadMock,
  killTmuxSession: killTmuxSessionMock,
}));

describe("shouldRenderTui", () => {
  describe("when the render-TUI flag is set", () => {
    it("returns true", () => {
      stubEnv("ORC_INTERNAL_RENDER_TUI", "1");
      expect(shouldRenderTui()).toBe(true);
    });
  });

  describe("when the render-TUI flag is not set", () => {
    it("returns false", () => {
      stubEnv("ORC_INTERNAL_RENDER_TUI", undefined);
      expect(shouldRenderTui()).toBe(false);
    });
  });
});

describe("attachOrSwitchToControlSession", () => {
  it("runs the TUI in the control session with its status bar hidden, kept on a crash", async () => {
    await attachOrSwitchToControlSession();

    expect(createTmuxSessionUnlessExistsMock).toHaveBeenCalledWith(
      CONTROL_SESSION,
      expect.stringContaining("ORC_INTERNAL_RENDER_TUI=1"),
      { statusBar: false, remainOnExit: "failed" },
    );
  });

  describe("when the control session has a dead pane", () => {
    beforeEach(() => {
      hasTmuxSessionMock.mockResolvedValue(true);
      isTmuxSessionDeadMock.mockResolvedValue(true);
    });

    it("kills the dead session before recreating it", async () => {
      await attachOrSwitchToControlSession();

      expect(killTmuxSessionMock).toHaveBeenCalledWith(CONTROL_SESSION);
    });
  });

  describe("when the control session is alive", () => {
    beforeEach(() => {
      hasTmuxSessionMock.mockResolvedValue(true);
      isTmuxSessionDeadMock.mockResolvedValue(false);
    });

    it("does not kill the session", async () => {
      await attachOrSwitchToControlSession();

      expect(killTmuxSessionMock).not.toHaveBeenCalled();
    });
  });

  describe("when inside an orc tmux session", () => {
    beforeEach(async () => {
      isInsideOrcTmuxSessionMock.mockReturnValue(true);
      await attachOrSwitchToControlSession();
    });

    it("switches the client to the control session", () => {
      expect(switchTmuxSessionMock).toHaveBeenCalledWith(CONTROL_SESSION);
    });
  });

  describe("when not inside an orc tmux session", () => {
    beforeEach(async () => {
      isInsideOrcTmuxSessionMock.mockReturnValue(false);
      await attachOrSwitchToControlSession();
    });

    it("attaches the terminal to the control session", () => {
      expect(attachTmuxSessionMock).toHaveBeenCalledWith(CONTROL_SESSION);
    });
  });
});
