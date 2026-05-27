import { sessionFactory } from "../../test/factories/session.ts";
import type { Session } from "../types.ts";
import { isMainWorktree, isMainWorktreeInUse } from "./main-worktree.ts";
import { describe, expect, it, mock } from "bun:test";

const listTmuxSessionsMock = mock((): Promise<Session[]> => Promise.resolve([]));

await mock.module("../commands/tmux.ts", () => ({
  listTmuxSessions: listTmuxSessionsMock,
}));

describe("isMainWorktree", () => {
  describe("when the session is on the main worktree", () => {
    it("returns true", () => {
      expect(isMainWorktree(sessionFactory.build({ worktree: "main" }))).toBe(true);
    });
  });

  describe("when the session is on a linked worktree", () => {
    it("returns false", () => {
      expect(isMainWorktree(sessionFactory.build({ worktree: "linked" }))).toBe(false);
    });
  });
});

describe("isMainWorktreeInUse", () => {
  describe("when no sessions exist for the project", () => {
    it("returns false", async () => {
      listTmuxSessionsMock.mockResolvedValue([]);
      expect(await isMainWorktreeInUse("orc")).toBe(false);
    });
  });

  describe("when a session for the project is on the main worktree", () => {
    it("returns true", async () => {
      listTmuxSessionsMock.mockResolvedValue([
        sessionFactory.build({ project: "orc", session: "feature-a", worktree: "main" }),
      ]);

      expect(await isMainWorktreeInUse("orc")).toBe(true);
    });
  });

  describe("when every session for the project is on a linked worktree", () => {
    it("returns false", async () => {
      listTmuxSessionsMock.mockResolvedValue([
        sessionFactory.build({ project: "orc", session: "feature-a", worktree: "linked" }),
      ]);

      expect(await isMainWorktreeInUse("orc")).toBe(false);
    });
  });

  describe("when only another project's session is on the main worktree", () => {
    it("returns false", async () => {
      listTmuxSessionsMock.mockResolvedValue([
        sessionFactory.build({ project: "other", session: "feature-b", worktree: "main" }),
      ]);

      expect(await isMainWorktreeInUse("orc")).toBe(false);
    });
  });
});
