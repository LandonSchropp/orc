import { projectFactory } from "../../../test/factories/project.ts";
import type { Project } from "../../types.ts";
import { moveLeft, moveRight } from "./move.ts";
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

describe("moveLeft", () => {
  describe("when the cursor is in the middle of a row", () => {
    it("moves to the previous session", () => {
      expect(moveLeft(projects, "orc/b", 3)).toBe("orc/a");
    });
  });

  describe("when the cursor is at the start of a row", () => {
    it("stays in place", () => {
      expect(moveLeft(projects, "orc/a", 3)).toBe("orc/a");
    });

    it("stays in place on a partial row", () => {
      expect(moveLeft(projects, "orc/d", 3)).toBe("orc/d");
    });
  });

  describe("when there is no current selection", () => {
    it("falls back to the first session of the first project", () => {
      expect(moveLeft(projects, null, 3)).toBe("orc/a");
    });
  });

  describe("when the selection can't be found", () => {
    it("falls back to the first session of the first project", () => {
      expect(moveLeft(projects, "ghost/g", 3)).toBe("orc/a");
    });
  });
});

describe("moveRight", () => {
  describe("when the cursor is in the middle of a row", () => {
    it("moves to the next session", () => {
      expect(moveRight(projects, "orc/a", 3)).toBe("orc/b");
    });
  });

  describe("when the cursor is at the end of a row", () => {
    it("stays in place", () => {
      expect(moveRight(projects, "orc/c", 3)).toBe("orc/c");
    });
  });

  describe("when the cursor is on the last session of a project", () => {
    it("stays in place", () => {
      expect(moveRight(projects, "orc/e", 3)).toBe("orc/e");
    });
  });

  describe("when there is no current selection", () => {
    it("falls back to the first session of the first project", () => {
      expect(moveRight(projects, null, 3)).toBe("orc/a");
    });
  });

  describe("when the selection can't be found", () => {
    it("falls back to the first session of the first project", () => {
      expect(moveRight(projects, "ghost/g", 3)).toBe("orc/a");
    });
  });
});
