import { sessionFactory } from "../../test/factories/session.ts";
import type { Session } from "../types.ts";
import { deleteSession } from "./delete.ts";
import { beforeEach, describe, expect, it, mock } from "bun:test";
import { homedir } from "node:os";

const getCurrentSessionMock = mock((): Promise<Session | null> => Promise.resolve(null));
const detachTmuxClientMock = mock((): Promise<void> => Promise.resolve());
const killTmuxSessionMock = mock((): Promise<void> => Promise.resolve());
const readTmuxinatorProjectMock = mock(() =>
  Promise.resolve({ name: "test-project", root: "/repos/test-project" }),
);
const removeWorktreeMock = mock((): Promise<void> => Promise.resolve());
const removeSessionStateFilesMock = mock((): Promise<void> => Promise.resolve());
const existsSyncMock = mock((): boolean => true);

await mock.module("./current.ts", () => ({
  getCurrentSession: getCurrentSessionMock,
}));

await mock.module("../commands/tmux.ts", () => ({
  detachTmuxClient: detachTmuxClientMock,
  killTmuxSession: killTmuxSessionMock,
}));

await mock.module("./identifier.ts", () => ({
  sessionIdentifier: (project: string, session: string) => `${project}/${session}`,
}));

await mock.module("../commands/tmuxinator.ts", () => ({
  readTmuxinatorProject: readTmuxinatorProjectMock,
}));

await mock.module("../commands/git.ts", () => ({
  removeWorktree: removeWorktreeMock,
}));

await mock.module("./state.ts", () => ({
  removeSessionStateFiles: removeSessionStateFilesMock,
}));

await mock.module("node:fs", () => ({
  existsSync: existsSyncMock,
}));

const repoPath = "/repos/test-project";
const worktreePath = `${homedir()}/.cache/orc/worktrees/test-project/feature-a`;

describe("deleteSession", () => {
  describe("when not attached to the target session", () => {
    beforeEach(async () => {
      getCurrentSessionMock.mockResolvedValue(null);
      existsSyncMock.mockReturnValue(true);
      await deleteSession("test-project", "feature-a");
    });

    it("does not detach the tmux client", () => {
      expect(detachTmuxClientMock).not.toHaveBeenCalled();
    });

    it("removes the worktree", () => {
      expect(removeWorktreeMock).toHaveBeenCalledWith(repoPath, worktreePath);
    });

    it("kills the tmux session", () => {
      expect(killTmuxSessionMock).toHaveBeenCalledWith("test-project/feature-a");
    });

    it("removes the agent state files for the session", () => {
      expect(removeSessionStateFilesMock).toHaveBeenCalledWith("test-project", "feature-a");
    });
  });

  describe("when attached to the target session", () => {
    beforeEach(async () => {
      getCurrentSessionMock.mockResolvedValue(
        sessionFactory.build({ project: "test-project", session: "feature-a" }),
      );
      existsSyncMock.mockReturnValue(true);
      await deleteSession("test-project", "feature-a");
    });

    it("detaches the tmux client", () => {
      expect(detachTmuxClientMock).toHaveBeenCalled();
    });

    it("removes the worktree", () => {
      expect(removeWorktreeMock).toHaveBeenCalledWith(repoPath, worktreePath);
    });

    it("kills the tmux session", () => {
      expect(killTmuxSessionMock).toHaveBeenCalledWith("test-project/feature-a");
    });
  });

  describe("when attached to a different session", () => {
    beforeEach(async () => {
      getCurrentSessionMock.mockResolvedValue(
        sessionFactory.build({ project: "other-project", session: "feature-z" }),
      );
      existsSyncMock.mockReturnValue(true);
      await deleteSession("test-project", "feature-a");
    });

    it("does not detach the tmux client", () => {
      expect(detachTmuxClientMock).not.toHaveBeenCalled();
    });
  });

  describe("when the worktree does not exist", () => {
    beforeEach(async () => {
      getCurrentSessionMock.mockResolvedValue(null);
      existsSyncMock.mockReturnValue(false);
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
