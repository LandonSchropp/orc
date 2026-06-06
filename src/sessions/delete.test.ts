import { deleteSession } from "./delete.ts";
import { beforeEach, describe, expect, it, mock } from "bun:test";
import { homedir } from "node:os";

const killTmuxSessionMock = mock((): Promise<void> => Promise.resolve());
const mainWorktreeRootMock = mock((): Promise<string> => Promise.resolve("/repos/test-project"));
const removeWorktreeMock = mock((): Promise<void> => Promise.resolve());
const removeSessionStateFilesMock = mock((): Promise<void> => Promise.resolve());
const existsMock = mock((): Promise<boolean> => Promise.resolve(true));
const removeSessionFileMock = mock((): Promise<void> => Promise.resolve());

await mock.module("../commands/tmux.ts", () => ({
  killTmuxSession: killTmuxSessionMock,
}));

await mock.module("./id.ts", () => ({
  sessionId: (project: string, session: string) => `${project}/${session}`,
}));

await mock.module("../commands/git.ts", () => ({
  mainWorktreeRoot: mainWorktreeRootMock,
  removeWorktree: removeWorktreeMock,
}));

await mock.module("./state.ts", () => ({
  removeSessionStateFiles: removeSessionStateFilesMock,
}));

await mock.module("../utilities/exists.ts", () => ({
  exists: existsMock,
}));

await mock.module("./session-file.ts", () => ({
  removeSessionFile: removeSessionFileMock,
}));

const repositoryRoot = "/repos/test-project";
const worktreePath = `${homedir()}/.cache/orc/worktrees/test-project/feature-a`;

describe("deleteSession", () => {
  describe("when the worktree exists", () => {
    beforeEach(async () => {
      existsMock.mockResolvedValue(true);
      await deleteSession("test-project", "feature-a");
    });

    it("resolves the repository from the worktree path", () => {
      expect(mainWorktreeRootMock).toHaveBeenCalledWith(worktreePath);
    });

    it("removes the worktree from the resolved repository", () => {
      expect(removeWorktreeMock).toHaveBeenCalledWith(repositoryRoot, worktreePath);
    });

    it("kills the tmux session", () => {
      expect(killTmuxSessionMock).toHaveBeenCalledWith("test-project/feature-a");
    });

    it("removes the agent state files for the session", () => {
      expect(removeSessionStateFilesMock).toHaveBeenCalledWith("test-project", "feature-a");
    });

    it("removes the session file", () => {
      expect(removeSessionFileMock).toHaveBeenCalledWith("test-project", "feature-a");
    });

    it("kills the tmux session before removing the worktree", () => {
      expect(killTmuxSessionMock.mock.invocationCallOrder[0]).toBeLessThan(
        removeWorktreeMock.mock.invocationCallOrder[0],
      );
    });
  });

  describe("when the worktree does not exist", () => {
    beforeEach(async () => {
      existsMock.mockResolvedValue(false);
      await deleteSession("test-project", "feature-a");
    });

    it("does not call removeWorktree", () => {
      expect(removeWorktreeMock).not.toHaveBeenCalled();
    });

    it("kills the tmux session", () => {
      expect(killTmuxSessionMock).toHaveBeenCalledWith("test-project/feature-a");
    });
  });
});
