import { isTmuxinatorInstalled } from "./tmuxinator.ts";
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
