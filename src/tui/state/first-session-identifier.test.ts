import { projectFactory } from "../../../test/factories/project.ts";
import { firstSessionIdentifier } from "./first-session-identifier.ts";
import { describe, expect, it } from "bun:test";

describe("firstSessionIdentifier", () => {
  describe("when the projects list has sessions", () => {
    it("returns the identifier of the first session in the first project", () => {
      const projects = [
        projectFactory.build({ project: "orc" }, { transient: { sessions: ["a", "b"] } }),
        projectFactory.build({ project: "notes" }, { transient: { sessions: ["x"] } }),
      ];

      expect(firstSessionIdentifier(projects)).toBe("orc/a");
    });
  });

  describe("when the projects list is empty", () => {
    it("returns null", () => {
      expect(firstSessionIdentifier([])).toBeNull();
    });
  });

  describe("when the first project has no sessions", () => {
    it("returns null", () => {
      const projects = [projectFactory.build({ project: "orc" })];

      expect(firstSessionIdentifier(projects)).toBeNull();
    });
  });
});
