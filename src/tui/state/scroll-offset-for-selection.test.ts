import { projectFactory } from "../../../test/factories/project.ts";
import { scrollOffsetForSelection } from "./scroll-offset-for-selection.ts";
import { describe, expect, it } from "bun:test";

// One column, so each session is its own row. With a header of 2 rows and rows of 4, the session
// tops are a=2, b=6, c=10, d=14, e=18 and the total content height is 22. A 14-row window leaves a
// 12-row viewport after the 1-row header and footer.
const project = projectFactory.build(
  { project: "p" },
  { transient: { sessions: ["a", "b", "c", "d", "e"] } },
);

describe("scrollOffsetForSelection", () => {
  describe("when nothing is selected", () => {
    it("returns the current offset", () => {
      expect(scrollOffsetForSelection([project], null, 1, 7, 14)).toBe(7);
    });
  });

  describe("when the selection sits within the viewport", () => {
    it("keeps the current offset", () => {
      expect(scrollOffsetForSelection([project], "p/b", 1, 2, 14)).toBe(2);
    });
  });

  describe("when the selection is above the top margin", () => {
    it("scrolls up to reveal it", () => {
      expect(scrollOffsetForSelection([project], "p/a", 1, 10, 14)).toBe(0);
    });
  });

  describe("when the selection is past the bottom margin", () => {
    it("scrolls down, clamped to the bottom of the content", () => {
      expect(scrollOffsetForSelection([project], "p/e", 1, 0, 14)).toBe(10);
    });
  });
});
