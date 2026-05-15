import { newCommand } from "./new.ts";
import { describe, expect, it, mock } from "bun:test";
import { runCommand } from "citty";

const createSessionMock = mock((): Promise<void> => Promise.resolve());

await mock.module("../sessions/create.ts", () => ({
  createSession: createSessionMock,
}));

describe("newCommand", () => {
  it("creates a session for the given project and session name", async () => {
    await runCommand(newCommand, { rawArgs: ["test-project", "feature-a"] });
    expect(createSessionMock).toHaveBeenCalledWith("test-project", "feature-a");
  });
});
