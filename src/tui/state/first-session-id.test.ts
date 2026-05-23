import { projectFactory } from "../../../test/factories/project.ts";
import { firstSessionId } from "./first-session-id.ts";
import { describe, expect, it } from "bun:test";

describe("firstSessionId", () => {
  describe("when the projects list has sessions", () => {
    it("returns the id of the first session in the first project", () => {
      const projects = [
        projectFactory.build({ project: "orc" }, { transient: { sessions: ["a", "b"] } }),
        projectFactory.build({ project: "notes" }, { transient: { sessions: ["x"] } }),
      ];

      expect(firstSessionId(projects)).toBe("orc/a");
    });
  });

  describe("when the projects list is empty", () => {
    it("returns null", () => {
      expect(firstSessionId([])).toBeNull();
    });
  });

  describe("when the first project has no sessions", () => {
    it("returns null", () => {
      const projects = [projectFactory.build({ project: "orc" })];

      expect(firstSessionId(projects)).toBeNull();
    });
  });
});
