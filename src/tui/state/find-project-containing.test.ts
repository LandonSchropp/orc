import { projectFactory } from "../../../test/factories/project.ts";
import { findProjectContaining } from "./find-project-containing.ts";
import { describe, expect, it } from "bun:test";

describe("findProjectContaining", () => {
  describe("when the identifier belongs to a project", () => {
    it("returns that project", () => {
      const orc = projectFactory.build({ project: "orc" }, { transient: { sessions: ["a"] } });
      const notes = projectFactory.build({ project: "notes" }, { transient: { sessions: ["x"] } });

      expect(findProjectContaining([orc, notes], "notes/x")).toBe(notes);
    });
  });

  describe("when the identifier is missing", () => {
    it("returns undefined", () => {
      const projects = [
        projectFactory.build({ project: "orc" }, { transient: { sessions: ["a"] } }),
      ];

      expect(findProjectContaining(projects, "ghost/g")).toBeUndefined();
    });
  });

  describe("when the identifier is null", () => {
    it("returns undefined", () => {
      const projects = [
        projectFactory.build({ project: "orc" }, { transient: { sessions: ["a"] } }),
      ];

      expect(findProjectContaining(projects, null)).toBeUndefined();
    });
  });
});
