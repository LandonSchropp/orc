import { orc } from "./orc.ts";
import { describe, expect, it, mock } from "bun:test";
import { runCommand } from "citty";

const runTuiMock = mock(() => Promise.resolve());

await mock.module("../tui/index.ts", () => ({
  runTui: runTuiMock,
}));

describe("orc", () => {
  describe("when run without a subcommand", () => {
    it("launches the TUI", async () => {
      await runCommand(orc, { rawArgs: [] });
      expect(runTuiMock).toHaveBeenCalled();
    });
  });
});
