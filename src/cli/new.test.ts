import { newCommand } from "./new.ts";
import { describe, expect, it, mock } from "bun:test";
import { runCommand } from "citty";

const createSessionMock = mock((): Promise<void> => Promise.resolve());

await mock.module("../sessions/create.ts", () => ({
  createSession: createSessionMock,
}));

describe("newCommand", () => {
  describe("when no flags are provided", () => {
    it("creates a session with the worktree option enabled", async () => {
      await runCommand(newCommand, { rawArgs: ["test-project", "feature-a"] });
      expect(createSessionMock).toHaveBeenCalledWith("test-project", "feature-a", {
        worktree: true,
      });
    });
  });

  describe("when the --no-worktree flag is provided", () => {
    it("creates a session with the worktree option disabled", async () => {
      await runCommand(newCommand, { rawArgs: ["test-project", "feature-a", "--no-worktree"] });
      expect(createSessionMock).toHaveBeenCalledWith("test-project", "feature-a", {
        worktree: false,
      });
    });
  });
});
