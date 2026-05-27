import { createSession } from "./create.ts";
import { beforeEach, describe, expect, it, mock } from "bun:test";
import { homedir } from "node:os";

const readTmuxinatorProjectMock = mock(() =>
  Promise.resolve({
    name: "test-project",
    root: "/repos/test-project",
  }),
);
const startTmuxinatorProjectMock = mock((): Promise<void> => Promise.resolve());
const defaultBranchMock = mock((): Promise<string | null> => Promise.resolve("main"));
const branchExistsMock = mock((): Promise<boolean> => Promise.resolve(false));
const addWorktreeMock = mock((): Promise<void> => Promise.resolve());
const switchSessionMock = mock((): Promise<void> => Promise.resolve());
const isMainWorktreeInUseMock = mock((): Promise<boolean> => Promise.resolve(true));
const mkdirSpy = mock((): Promise<string | undefined> => Promise.resolve(undefined));

await mock.module("../commands/tmuxinator.ts", () => ({
  readTmuxinatorProject: readTmuxinatorProjectMock,
  startTmuxinatorProject: startTmuxinatorProjectMock,
}));

await mock.module("../commands/git.ts", () => ({
  defaultBranch: defaultBranchMock,
  branchExists: branchExistsMock,
  addWorktree: addWorktreeMock,
}));

await mock.module("./switch.ts", () => ({
  switchSession: switchSessionMock,
}));

await mock.module("./main-worktree.ts", () => ({
  isMainWorktreeInUse: isMainWorktreeInUseMock,
}));

await mock.module("node:fs/promises", () => ({
  mkdir: mkdirSpy,
}));

const repoPath = "/repos/test-project";
const worktreeParent = `${homedir()}/.cache/orc/worktrees/test-project`;
const worktreePath = `${worktreeParent}/feature-a`;

describe("createSession", () => {
  describe("when the main worktree is in use", () => {
    beforeEach(() => {
      isMainWorktreeInUseMock.mockResolvedValue(true);
    });

    describe("when the branch does not yet exist", () => {
      beforeEach(() => {
        branchExistsMock.mockResolvedValue(false);
      });

      describe("when the default branch can be determined", () => {
        beforeEach(async () => {
          defaultBranchMock.mockResolvedValue("main");
          await createSession("test-project", "feature-a");
        });

        it("creates the worktree parent directory", () => {
          expect(mkdirSpy).toHaveBeenCalledWith(worktreeParent, { recursive: true });
        });

        it("adds a Git worktree with a new branch from the default branch", () => {
          expect(addWorktreeMock).toHaveBeenCalledWith(repoPath, worktreePath, "feature-a", "main");
        });

        it("starts the tmuxinator project with the worktree as the root", () => {
          expect(startTmuxinatorProjectMock).toHaveBeenCalledWith(
            "test-project",
            "feature-a",
            worktreePath,
          );
        });

        it("switches to the new session", () => {
          expect(switchSessionMock).toHaveBeenCalledWith("test-project", "feature-a");
        });
      });

      describe("when the default branch cannot be determined", () => {
        it("throws an error", () => {
          defaultBranchMock.mockResolvedValue(null);
          expect(createSession("test-project", "feature-a")).rejects.toThrow(/default branch/i);
        });
      });
    });

    describe("when the branch already exists", () => {
      beforeEach(async () => {
        branchExistsMock.mockResolvedValue(true);
        await createSession("test-project", "feature-a");
      });

      it("creates the worktree parent directory", () => {
        expect(mkdirSpy).toHaveBeenCalledWith(worktreeParent, { recursive: true });
      });

      it("checks out the existing branch in the worktree", () => {
        expect(addWorktreeMock).toHaveBeenCalledWith(repoPath, worktreePath, "feature-a");
      });

      it("does not look up the default branch", () => {
        expect(defaultBranchMock).not.toHaveBeenCalled();
      });

      it("starts the tmuxinator project with the worktree as the root", () => {
        expect(startTmuxinatorProjectMock).toHaveBeenCalledWith(
          "test-project",
          "feature-a",
          worktreePath,
        );
      });

      it("switches to the session", () => {
        expect(switchSessionMock).toHaveBeenCalledWith("test-project", "feature-a");
      });
    });
  });

  describe("when the main worktree is free", () => {
    beforeEach(async () => {
      isMainWorktreeInUseMock.mockResolvedValue(false);
      await createSession("test-project", "feature-a");
    });

    it("does not look up the default branch", () => {
      expect(defaultBranchMock).not.toHaveBeenCalled();
    });

    it("does not add a Git worktree", () => {
      expect(addWorktreeMock).not.toHaveBeenCalled();
    });

    it("starts the tmuxinator project at the project root", () => {
      expect(startTmuxinatorProjectMock).toHaveBeenCalledWith(
        "test-project",
        "feature-a",
        repoPath,
      );
    });

    it("switches to the new session", () => {
      expect(switchSessionMock).toHaveBeenCalledWith("test-project", "feature-a");
    });
  });
});
