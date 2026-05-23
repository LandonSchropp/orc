import { projectFactory } from "../../../test/factories/project.ts";
import type { Project } from "../../types.ts";
import { sessionColumn } from "./session-column.ts";
import { beforeEach, describe, expect, it } from "bun:test";

let projects: Project[];

beforeEach(() => {
  projects = [
    projectFactory.build(
      { project: "orc" },
      { transient: { sessions: ["a", "b", "c", "d", "e"] } },
    ),
  ];
});

describe("sessionColumn", () => {
  describe("when the session is in the middle of a row", () => {
    it("returns its column index", () => {
      expect(sessionColumn(projects, "orc/b", 3)).toBe(1);
    });
  });

  describe("when the session is at the start of a row", () => {
    it("returns 0", () => {
      expect(sessionColumn(projects, "orc/d", 3)).toBe(0);
    });
  });

  describe("when the session can't be found", () => {
    it("returns null", () => {
      expect(sessionColumn(projects, "ghost/g", 3)).toBeNull();
    });
  });

  describe("when the session id is null", () => {
    it("returns null", () => {
      expect(sessionColumn(projects, null, 3)).toBeNull();
    });
  });
});
