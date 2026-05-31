import { sessionFactory } from "../../test/factories/session.ts";
import { isMainWorktree } from "./main-worktree.ts";
import { describe, expect, it } from "bun:test";

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
