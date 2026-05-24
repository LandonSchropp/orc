import { orc } from "./orc.ts";
import { describe, expect, it, mock } from "bun:test";
import type { CommandContext } from "citty";
import { runCommand } from "citty";

const runTuiMock = mock(() => Promise.resolve());

await mock.module("../tui/index.tsx", () => ({
  runTui: runTuiMock,
}));

describe("orc", () => {
  describe("when run without a subcommand", () => {
    it("launches the TUI", async () => {
      await runCommand(orc, { rawArgs: [] });
      expect(runTuiMock).toHaveBeenCalled();
    });
  });

  describe("when run with a subcommand", () => {
    it("does not launch the TUI", async () => {
      // Called directly rather than through `runCommand` so the real subcommand doesn't execute.
      // citty invokes the parent `run` after dispatching a subcommand, which is the path guarded.
      const context = { rawArgs: ["hook", "status"] } as CommandContext;

      await orc.run?.(context);

      expect(runTuiMock).not.toHaveBeenCalled();
    });
  });
});
