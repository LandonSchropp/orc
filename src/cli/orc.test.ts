import { stubEnv } from "../../test/helpers/env.ts";
import { orc } from "./orc.ts";
import { beforeEach, describe, expect, it, mock } from "bun:test";
import type { CommandContext } from "citty";
import { runCommand } from "citty";

const runTuiMock = mock(() => Promise.resolve());
const openTmuxPopupMock = mock(() => Promise.resolve());

await mock.module("../tui/index.tsx", () => ({
  runTui: runTuiMock,
}));

await mock.module("../commands/tmux.ts", () => ({
  openTmuxPopup: openTmuxPopupMock,
}));

beforeEach(() => {
  stubEnv("TMUX", undefined);
  stubEnv("ORC_POPUP", undefined);
});

describe("orc", () => {
  describe("when run without a subcommand outside of tmux", () => {
    it("launches the TUI", async () => {
      await runCommand(orc, { rawArgs: [] });

      expect(runTuiMock).toHaveBeenCalled();
      expect(openTmuxPopupMock).not.toHaveBeenCalled();
    });
  });

  describe("when run without a subcommand inside tmux", () => {
    it("opens a popup that re-invokes the current orc process with ORC_POPUP=1", async () => {
      stubEnv("TMUX", "/tmp/tmux-501/default,12345,0");

      await runCommand(orc, { rawArgs: [] });

      expect(runTuiMock).not.toHaveBeenCalled();
      expect(openTmuxPopupMock).toHaveBeenCalledWith(expect.stringMatching(/^ORC_POPUP=1 /));
      expect(openTmuxPopupMock).toHaveBeenCalledWith(expect.stringContaining(process.execPath));
    });
  });

  describe("when run from inside the orc popup", () => {
    it("launches the TUI directly without re-opening a popup", async () => {
      stubEnv("TMUX", "/tmp/tmux-501/default,12345,0");
      stubEnv("ORC_POPUP", "1");

      await runCommand(orc, { rawArgs: [] });

      expect(runTuiMock).toHaveBeenCalled();
      expect(openTmuxPopupMock).not.toHaveBeenCalled();
    });
  });

  describe("when run with a subcommand", () => {
    it("does not launch the TUI", async () => {
      // Called directly rather than through `runCommand` so the real subcommand doesn't execute.
      // citty invokes the parent `run` after dispatching a subcommand, which is the path guarded.
      const context = { rawArgs: ["hook", "status"] } as CommandContext;

      await orc.run?.(context);

      expect(runTuiMock).not.toHaveBeenCalled();
      expect(openTmuxPopupMock).not.toHaveBeenCalled();
    });
  });
});
