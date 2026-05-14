import { defaultBranch, isGitInstalled } from "./git.ts";
import { describe, expect, it, mock } from "bun:test";

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
