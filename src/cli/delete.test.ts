import { deleteCommand } from "./delete.ts";
import { describe, expect, it, mock } from "bun:test";
import { runCommand } from "citty";

const deleteSessionMock = mock((): Promise<void> => Promise.resolve());

await mock.module("../sessions/delete.ts", () => ({
  deleteSession: deleteSessionMock,
}));

describe("deleteCommand", () => {
  it("deletes the session for the given project and session name", async () => {
    await runCommand(deleteCommand, { rawArgs: ["test-project", "feature-a"] });
    expect(deleteSessionMock).toHaveBeenCalledWith("test-project", "feature-a");
  });
});
