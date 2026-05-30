import { projectFactory } from "../../../test/factories/project.ts";
import { findSession } from "./find-session.ts";
import { describe, expect, it } from "bun:test";

describe("findSession", () => {
  describe("when a session with the given id exists", () => {
    it("returns the session", () => {
      const project = projectFactory.build(
        { project: "orc" },
        { transient: { sessions: ["tui", "main"] } },
      );

      const result = findSession([project], "orc/main");

      expect(result?.session).toBe("main");
    });
  });

  describe("when no session matches the id", () => {
    it("returns undefined", () => {
      const project = projectFactory.build(
        { project: "orc" },
        { transient: { sessions: ["tui"] } },
      );

      const result = findSession([project], "orc/ghost");

      expect(result).toBeUndefined();
    });
  });

  describe("when the id is null", () => {
    it("returns undefined", () => {
      const project = projectFactory.build(
        { project: "orc" },
        { transient: { sessions: ["tui"] } },
      );

      const result = findSession([project], null);

      expect(result).toBeUndefined();
    });
  });
});
