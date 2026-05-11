import { isTmuxInstalled, listTmuxSessions } from "./tmux.ts";
import { describe, expect, it, mock } from "bun:test";

const runCommandMock = mock(() => Promise.resolve({ exitCode: 0, stdout: "", stderr: "" }));

await mock.module("./shell.ts", () => ({
  runCommand: runCommandMock,
}));

describe("isTmuxInstalled", () => {
  describe("when tmux is available", () => {
    it("returns true", async () => {
      runCommandMock.mockResolvedValue({ exitCode: 0, stdout: "", stderr: "" });
      expect(await isTmuxInstalled()).toBe(true);
    });
  });

  describe("when tmux is not available", () => {
    it("returns false", async () => {
      runCommandMock.mockResolvedValue({ exitCode: 1, stdout: "", stderr: "" });
      expect(await isTmuxInstalled()).toBe(false);
    });
  });

  describe("when tmux is not installed", () => {
    it("returns false", async () => {
      runCommandMock.mockResolvedValue({ exitCode: 127, stdout: "", stderr: "" });
      expect(await isTmuxInstalled()).toBe(false);
    });
  });
});

describe("listTmuxSessions", () => {
  describe("when no server is running", () => {
    it("returns an empty array", async () => {
      runCommandMock.mockResolvedValue({
        exitCode: 1,
        stdout: "",
        stderr: "no server running on /tmp/tmux-501/orc\n",
      });
      expect(await listTmuxSessions()).toEqual([]);
    });
  });

  describe("when there are no sessions", () => {
    it("returns an empty array", async () => {
      runCommandMock.mockResolvedValue({ exitCode: 0, stdout: "", stderr: "" });
      expect(await listTmuxSessions()).toEqual([]);
    });
  });

  describe("when there are sessions", () => {
    it("returns an array of parsed session objects", async () => {
      runCommandMock.mockResolvedValue({
        exitCode: 0,
        stdout: "orc:feature-a\t1700000000\t0\norc:feature-b\t1700000100\t1\n",
        stderr: "",
      });
      expect(await listTmuxSessions()).toEqual([
        {
          project: "orc",
          session: "feature-a",
          name: "orc:feature-a",
          createdAt: new Date(1_700_000_000 * 1000),
          attached: false,
        },
        {
          project: "orc",
          session: "feature-b",
          name: "orc:feature-b",
          createdAt: new Date(1_700_000_100 * 1000),
          attached: true,
        },
      ]);
    });
  });

  describe("when a session name is missing a colon", () => {
    it("throws an error", () => {
      runCommandMock.mockResolvedValue({
        exitCode: 0,
        stdout: "no-colon\t1700000000\t0\n",
        stderr: "",
      });
      expect(listTmuxSessions()).rejects.toThrowError(/no-colon/);
    });
  });

  describe("when tmux exits with an unexpected error", () => {
    it("throws an error", () => {
      runCommandMock.mockResolvedValue({
        exitCode: 1,
        stdout: "",
        stderr: "some other tmux error\n",
      });
      expect(listTmuxSessions()).rejects.toThrowError(/some other tmux error/);
    });
  });
});
