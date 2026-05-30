import { newCommand } from "./new.ts";
import { describe, expect, it, mock } from "bun:test";
import { runCommand } from "citty";

const createSessionMock = mock((): Promise<void> => Promise.resolve());

await mock.module("../sessions/create.ts", () => ({
  createSession: createSessionMock,
}));

describe("newCommand", () => {
  describe("when invoked with a project and session", () => {
    it("creates the session", async () => {
      await runCommand(newCommand, { rawArgs: ["test-project", "feature-a"] });
      expect(createSessionMock).toHaveBeenCalledWith("test-project", "feature-a");
    });
  });
});
