import {
  addWorktree,
  branchExists,
  defaultBranch,
  isGitInstalled,
  mainWorktreeRoot,
  removeWorktree,
  worktreeExists,
} from "./git.ts";
import { beforeEach, describe, expect, it, mock } from "bun:test";

const runCommandMock = mock(() => Promise.resolve({ exitCode: 0, stdout: "", stderr: "" }));

await mock.module("./shell.ts", () => ({
  runCommand: runCommandMock,
}));

describe("isGitInstalled", () => {
  describe("when git is available", () => {
    it("returns true", async () => {
      runCommandMock.mockResolvedValue({ exitCode: 0, stdout: "", stderr: "" });
      expect(await isGitInstalled()).toBe(true);
    });
  });

  describe("when git is not available", () => {
    it("returns false", async () => {
      runCommandMock.mockResolvedValue({ exitCode: 1, stdout: "", stderr: "" });
      expect(await isGitInstalled()).toBe(false);
    });
  });

  describe("when git is not installed", () => {
    it("returns false", async () => {
      runCommandMock.mockResolvedValue({ exitCode: 127, stdout: "", stderr: "" });
      expect(await isGitInstalled()).toBe(false);
    });
  });
});

describe("defaultBranch", () => {
  describe("when origin/HEAD is set", () => {
    it("returns the branch name", async () => {
      runCommandMock.mockResolvedValue({
        exitCode: 0,
        stdout: "refs/remotes/origin/main\n",
        stderr: "",
      });
      expect(await defaultBranch("/path/to/repo")).toBe("main");
    });
  });

  describe("when origin/HEAD is not set", () => {
    describe("when a local `main` branch exists", () => {
      it("returns `main`", async () => {
        runCommandMock.mockResolvedValueOnce({ exitCode: 1, stdout: "", stderr: "" });
        runCommandMock.mockResolvedValueOnce({ exitCode: 0, stdout: "", stderr: "" });
        expect(await defaultBranch("/path/to/repo")).toBe("main");
      });
    });

    describe("when a local `master` branch exists", () => {
      it("returns `master`", async () => {
        runCommandMock.mockResolvedValueOnce({ exitCode: 1, stdout: "", stderr: "" });
        runCommandMock.mockResolvedValueOnce({ exitCode: 1, stdout: "", stderr: "" });
        runCommandMock.mockResolvedValueOnce({ exitCode: 0, stdout: "", stderr: "" });
        expect(await defaultBranch("/path/to/repo")).toBe("master");
      });
    });

    describe("when no fallback branches exist", () => {
      it("returns null", async () => {
        runCommandMock.mockResolvedValue({ exitCode: 1, stdout: "", stderr: "" });
        expect(await defaultBranch("/path/to/repo")).toBeNull();
      });
    });
  });
});

describe("branchExists", () => {
  describe("when the branch exists", () => {
    it("returns true", async () => {
      runCommandMock.mockResolvedValue({ exitCode: 0, stdout: "", stderr: "" });

      expect(await branchExists("/repo", "feature-a")).toBe(true);

      expect(runCommandMock).toHaveBeenCalledWith([
        "git",
        "-C",
        "/repo",
        "show-ref",
        "--verify",
        "--quiet",
        "refs/heads/feature-a",
      ]);
    });
  });

  describe("when the branch does not exist", () => {
    it("returns false", async () => {
      runCommandMock.mockResolvedValue({ exitCode: 1, stdout: "", stderr: "" });

      expect(await branchExists("/repo", "feature-a")).toBe(false);
    });
  });
});

describe("worktreeExists", () => {
  describe("when a worktree is registered at the path", () => {
    it("returns true", async () => {
      runCommandMock.mockResolvedValue({
        exitCode: 0,
        stdout: [
          "worktree /repo",
          "HEAD abc123",
          "branch refs/heads/main",
          "",
          "worktree /worktree",
          "HEAD def456",
          "branch refs/heads/feature-a",
          "",
        ].join("\n"),
        stderr: "",
      });

      expect(await worktreeExists("/repo", "/worktree")).toBe(true);

      expect(runCommandMock).toHaveBeenCalledWith([
        "git",
        "-C",
        "/repo",
        "worktree",
        "list",
        "--porcelain",
      ]);
    });
  });

  describe("when no worktree is registered at the path", () => {
    it("returns false", async () => {
      runCommandMock.mockResolvedValue({
        exitCode: 0,
        stdout: ["worktree /repo", "HEAD abc123", "branch refs/heads/main", ""].join("\n"),
        stderr: "",
      });

      expect(await worktreeExists("/repo", "/worktree")).toBe(false);
    });
  });
});

describe("addWorktree", () => {
  describe("when a base branch is given", () => {
    it("invokes `git worktree add` with a new branch from the base branch", async () => {
      runCommandMock.mockResolvedValue({ exitCode: 0, stdout: "", stderr: "" });

      await addWorktree("/repo", "/worktree", "feature-a", "main");

      expect(runCommandMock).toHaveBeenCalledWith([
        "git",
        "-C",
        "/repo",
        "worktree",
        "add",
        "/worktree",
        "-b",
        "feature-a",
        "main",
      ]);
    });
  });

  describe("when no base branch is given", () => {
    it("invokes `git worktree add` for the existing branch", async () => {
      runCommandMock.mockResolvedValue({ exitCode: 0, stdout: "", stderr: "" });

      await addWorktree("/repo", "/worktree", "feature-a");

      expect(runCommandMock).toHaveBeenCalledWith([
        "git",
        "-C",
        "/repo",
        "worktree",
        "add",
        "/worktree",
        "feature-a",
      ]);
    });
  });

  describe("when git fails", () => {
    it("throws an error with the stderr message", () => {
      runCommandMock.mockResolvedValue({
        exitCode: 128,
        stdout: "",
        stderr: "fatal: '/worktree' already exists\n",
      });

      expect(addWorktree("/repo", "/worktree", "feature-a", "main")).rejects.toThrowError(
        /already exists/,
      );
    });
  });
});

describe("removeWorktree", () => {
  it("invokes `git worktree remove --force` for the given path", async () => {
    runCommandMock.mockResolvedValue({ exitCode: 0, stdout: "", stderr: "" });

    await removeWorktree("/repo", "/worktree");

    expect(runCommandMock).toHaveBeenCalledWith([
      "git",
      "-C",
      "/repo",
      "worktree",
      "remove",
      "--force",
      "/worktree",
    ]);
  });

  describe("when git fails", () => {
    it("throws an error with the stderr message", () => {
      runCommandMock.mockResolvedValue({
        exitCode: 128,
        stdout: "",
        stderr: "fatal: '/worktree' is not a working tree\n",
      });

      expect(removeWorktree("/repo", "/worktree")).rejects.toThrowError(/not a working tree/);
    });
  });
});

describe("mainWorktreeRoot", () => {
  describe("when git resolves the common directory", () => {
    beforeEach(() => {
      runCommandMock.mockResolvedValue({ exitCode: 0, stdout: "/repos/orc/.git\n", stderr: "" });
    });

    it("returns the parent of the common git directory", async () => {
      expect(await mainWorktreeRoot("/cache/worktrees/orc/feature-a")).toBe("/repos/orc");
    });

    it("resolves the absolute common git directory from the worktree", async () => {
      await mainWorktreeRoot("/cache/worktrees/orc/feature-a");

      expect(runCommandMock).toHaveBeenCalledWith([
        "git",
        "-C",
        "/cache/worktrees/orc/feature-a",
        "rev-parse",
        "--path-format=absolute",
        "--git-common-dir",
      ]);
    });
  });

  describe("when git fails", () => {
    it("throws an error with the stderr message", () => {
      runCommandMock.mockResolvedValue({
        exitCode: 128,
        stdout: "",
        stderr: "fatal: not a git repository\n",
      });

      expect(mainWorktreeRoot("/worktree")).rejects.toThrowError(/not a git repository/);
    });
  });
});
