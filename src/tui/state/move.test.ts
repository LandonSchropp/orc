import { projectFactory } from "../../../test/factories/project.ts";
import type { Project } from "../../types.ts";
import { moveDown, moveLeft, moveRight, moveUp } from "./move.ts";
import { beforeEach, describe, expect, it } from "bun:test";

let projects: Project[];

beforeEach(() => {
  projects = [
    projectFactory.build(
      { project: "orc" },
      { transient: { sessions: ["a", "b", "c", "d", "e"] } },
    ),
    projectFactory.build({ project: "notes" }, { transient: { sessions: ["x", "y", "z", "w"] } }),
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

describe("moveDown", () => {
  describe("when a row exists below in the current project", () => {
    it("moves to the same column in that row", () => {
      expect(moveDown(projects, "orc/a", null, 3)).toBe("orc/d");
    });

    describe("when the row below is shorter than the last selected column", () => {
      it("clamps to the last session of that row", () => {
        expect(moveDown(projects, "orc/c", null, 3)).toBe("orc/e");
      });
    });
  });

  describe("when there is no row below in the current project", () => {
    it("crosses to the first row of the next project", () => {
      expect(moveDown(projects, "orc/d", null, 3)).toBe("notes/x");
    });
  });

  describe("when there is no next project", () => {
    it("stays put", () => {
      expect(moveDown(projects, "notes/w", null, 3)).toBe("notes/w");
    });
  });

  describe("when a last selected column is provided", () => {
    it("uses it as the target column", () => {
      expect(moveDown(projects, "orc/e", 2, 3)).toBe("notes/z");
    });
  });

  describe("when the selection can't be found", () => {
    it("falls back to the first session of the first project", () => {
      expect(moveDown(projects, "ghost/g", null, 3)).toBe("orc/a");
    });
  });
});

describe("moveUp", () => {
  describe("when a row exists above in the current project", () => {
    it("moves to the same column in that row", () => {
      expect(moveUp(projects, "orc/d", null, 3)).toBe("orc/a");
    });
  });

  describe("when there is no row above in the current project", () => {
    it("crosses to the last row of the previous project", () => {
      expect(moveUp(projects, "notes/x", null, 3)).toBe("orc/d");
    });

    describe("when the previous project's last row is shorter than the last selected column", () => {
      it("clamps to the last session of that row", () => {
        expect(moveUp(projects, "notes/z", null, 3)).toBe("orc/e");
      });
    });
  });

  describe("when there is no previous project", () => {
    it("stays put", () => {
      expect(moveUp(projects, "orc/a", null, 3)).toBe("orc/a");
    });
  });

  describe("when a last selected column is provided", () => {
    it("uses it as the target column", () => {
      expect(moveUp(projects, "orc/e", 2, 3)).toBe("orc/c");
    });
  });

  describe("when the selection can't be found", () => {
    it("falls back to the first session of the first project", () => {
      expect(moveUp(projects, "ghost/g", null, 3)).toBe("orc/a");
    });
  });
});
