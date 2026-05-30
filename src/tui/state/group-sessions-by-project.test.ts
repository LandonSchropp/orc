import { sessionFactory } from "../../../test/factories/session.ts";
import { groupSessionsByProject } from "./group-sessions-by-project.ts";
import { describe, expect, it } from "bun:test";

describe("groupSessionsByProject", () => {
  describe("when the input is empty", () => {
    it("returns an empty list", () => {
      expect(groupSessionsByProject([])).toEqual([]);
    });
  });

  describe("when all sessions share a project", () => {
    it("groups them under one project", () => {
      const sessions = [
        sessionFactory.build({ project: "orc", session: "a" }),
        sessionFactory.build({ project: "orc", session: "b" }),
      ];
      expect(groupSessionsByProject(sessions)).toEqual([{ project: "orc", sessions }]);
    });
  });

  describe("when sessions span multiple projects", () => {
    it("groups them by project in alphabetical order", () => {
      const a = sessionFactory.build({ project: "orc", session: "a" });
      const b = sessionFactory.build({ project: "notes", session: "b" });
      const c = sessionFactory.build({ project: "orc", session: "c" });
      expect(groupSessionsByProject([a, b, c])).toEqual([
        { project: "notes", sessions: [b] },
        { project: "orc", sessions: [a, c] },
      ]);
    });
  });

  describe("when a project has multiple linked sessions", () => {
    it("orders them oldest-first by creation time", () => {
      const first = sessionFactory.build({
        session: "first",
        worktree: "linked",
        createdAt: new Date("2026-05-01T00:00:00.000Z"),
      });
      const second = sessionFactory.build({
        session: "second",
        worktree: "linked",
        createdAt: new Date("2026-05-02T00:00:00.000Z"),
      });
      const third = sessionFactory.build({
        session: "third",
        worktree: "linked",
        createdAt: new Date("2026-05-03T00:00:00.000Z"),
      });

      expect(groupSessionsByProject([third, first, second])).toEqual([
        { project: "orc", sessions: [first, second, third] },
      ]);
    });
  });

  describe("when a project has a main-worktree session", () => {
    it("puts it first regardless of creation time", () => {
      const olderLinked = sessionFactory.build({
        session: "older-linked",
        worktree: "linked",
        createdAt: new Date("2026-05-01T00:00:00.000Z"),
      });
      const newerLinked = sessionFactory.build({
        session: "newer-linked",
        worktree: "linked",
        createdAt: new Date("2026-05-02T00:00:00.000Z"),
      });
      const main = sessionFactory.build({
        session: "main",
        worktree: "main",
        createdAt: new Date("2026-05-03T00:00:00.000Z"),
      });

      expect(groupSessionsByProject([olderLinked, main, newerLinked])).toEqual([
        { project: "orc", sessions: [main, olderLinked, newerLinked] },
      ]);
    });
  });
});
