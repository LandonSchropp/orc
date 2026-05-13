import { isTmuxinatorInstalled, listTmuxinatorProjects } from "./tmuxinator.ts";
import { describe, expect, it, mock } from "bun:test";

const runCommandMock = mock(() => Promise.resolve({ exitCode: 0, stdout: "", stderr: "" }));

await mock.module("./shell.ts", () => ({
  runCommand: runCommandMock,
}));

describe("isTmuxinatorInstalled", () => {
  describe("when tmuxinator is available", () => {
    it("returns true", async () => {
      runCommandMock.mockResolvedValue({ exitCode: 0, stdout: "", stderr: "" });
      expect(await isTmuxinatorInstalled()).toBe(true);
    });
  });

  describe("when tmuxinator is not available", () => {
    it("returns false", async () => {
      runCommandMock.mockResolvedValue({ exitCode: 1, stdout: "", stderr: "" });
      expect(await isTmuxinatorInstalled()).toBe(false);
    });
  });

  describe("when tmuxinator is not installed", () => {
    it("returns false", async () => {
      runCommandMock.mockResolvedValue({ exitCode: 127, stdout: "", stderr: "" });
      expect(await isTmuxinatorInstalled()).toBe(false);
    });
  });
});

describe("listTmuxinatorProjects", () => {
  describe("when projects exist", () => {
    it("returns the project names without the header", async () => {
      runCommandMock.mockResolvedValue({
        exitCode: 0,
        stdout: "tmuxinator projects:\nagent-toolkit\ndotfiles\nnotes\n",
        stderr: "",
      });
      expect(await listTmuxinatorProjects()).toEqual(["agent-toolkit", "dotfiles", "notes"]);
    });
  });

  describe("when no projects exist", () => {
    it("returns an empty array", async () => {
      runCommandMock.mockResolvedValue({
        exitCode: 0,
        stdout: "tmuxinator projects:\n",
        stderr: "",
      });
      expect(await listTmuxinatorProjects()).toEqual([]);
    });
  });
});
