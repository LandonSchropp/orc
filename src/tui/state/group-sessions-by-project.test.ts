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

    it("preserves input order of sessions within each project", () => {
      const a = sessionFactory.build({ project: "orc", session: "a" });
      const b = sessionFactory.build({ project: "orc", session: "b" });
      const c = sessionFactory.build({ project: "orc", session: "c" });
      expect(groupSessionsByProject([c, a, b])).toEqual([{ project: "orc", sessions: [c, a, b] }]);
    });
  });
});
