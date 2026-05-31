import { projectFactory } from "../../../test/factories/project.ts";
import type { Project } from "../../types.ts";
import { pickNextSelection } from "./pick-next-selection.ts";
import { describe, expect, it } from "bun:test";

/**
 * Builds a project with the given name and session names.
 *
 * @param name The project name.
 * @param sessions The session names to populate the project with.
 * @returns The built project.
 */
function project(name: string, sessions: string[]): Project {
  return projectFactory.build({ project: name }, { transient: { sessions } });
}

describe("pickNextSelection", () => {
  describe("when the next list is empty", () => {
    it("returns null", () => {
      const previous = [project("orc", ["a"])];

      expect(pickNextSelection(previous, "orc/a", [])).toBeNull();
    });
  });

  describe("when there was no previous selection", () => {
    it("returns the first session in the first project", () => {
      const next = [project("notes", ["x"]), project("orc", ["a"])];

      expect(pickNextSelection([], null, next)).toBe("notes/x");
    });
  });

  describe("when the previously selected session is still present", () => {
    it("keeps the selection", () => {
      const previous = [project("orc", ["a", "b"])];
      const next = [project("orc", ["a", "b"])];

      expect(pickNextSelection(previous, "orc/a", next)).toBe("orc/a");
    });
  });

  describe("when the project still exists but the selection was removed", () => {
    describe("and there is a session to its right", () => {
      it("selects the next surviving session to the right", () => {
        const previous = [project("orc", ["a", "b", "c"])];
        const next = [project("orc", ["a", "c"])];

        expect(pickNextSelection(previous, "orc/b", next)).toBe("orc/c");
      });
    });

    describe("and only sessions to its left survive", () => {
      it("selects the nearest surviving session to the left", () => {
        const previous = [project("orc", ["a", "b", "c"])];
        const next = [project("orc", ["a"])];

        expect(pickNextSelection(previous, "orc/c", next)).toBe("orc/a");
      });
    });

    describe("and none of the previous sessions in that project survive", () => {
      it("falls back to the first session of the surviving project", () => {
        const previous = [project("orc", ["a", "b", "c"])];
        const next = [project("orc", ["x", "y"])];

        expect(pickNextSelection(previous, "orc/b", next)).toBe("orc/x");
      });
    });
  });

  describe("when the previously selected project is gone", () => {
    describe("and a project follows it in the previous order", () => {
      it("selects the first session of the next surviving project", () => {
        const previous = [
          project("dotfiles", ["a"]),
          project("orc", ["b"]),
          project("strawberry", ["c"]),
        ];
        const next = [project("dotfiles", ["a"]), project("strawberry", ["c"])];

        expect(pickNextSelection(previous, "orc/b", next)).toBe("strawberry/c");
      });
    });

    describe("and only projects to the left survive", () => {
      it("selects the first session of the nearest surviving project to the left", () => {
        const previous = [
          project("dotfiles", ["a"]),
          project("orc", ["b"]),
          project("strawberry", ["c"]),
        ];
        const next = [project("dotfiles", ["a"])];

        expect(pickNextSelection(previous, "orc/b", next)).toBe("dotfiles/a");
      });
    });

    describe("and none of the previous projects survive", () => {
      it("falls back to the first session of the first surviving project", () => {
        const previous = [project("orc", ["a"]), project("strawberry", ["b"])];
        const next = [project("notes", ["x"])];

        expect(pickNextSelection(previous, "orc/a", next)).toBe("notes/x");
      });
    });

    describe("and the nearest surviving session sits past a removed one to the left", () => {
      it("skips the removed session", () => {
        const previous = [project("orc", ["a", "b"]), project("strawberry", ["c"])];
        const next = [project("orc", ["a"])];

        expect(pickNextSelection(previous, "strawberry/c", next)).toBe("orc/a");
      });
    });
  });

  describe("when the previously selected session can't be located", () => {
    it("falls back to the first session in the first project", () => {
      const previous: Project[] = [];
      const next = [project("notes", ["x"]), project("orc", ["a"])];

      expect(pickNextSelection(previous, "ghost/g", next)).toBe("notes/x");
    });
  });
});
