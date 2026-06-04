import { compareStrings } from "./string.ts";
import { describe, expect, it } from "bun:test";

describe("compareStrings", () => {
  describe("when the first string sorts before the second", () => {
    it("returns a negative number", () => {
      expect(compareStrings("a", "b")).toBeLessThan(0);
    });
  });

  describe("when the first string sorts after the second", () => {
    it("returns a positive number", () => {
      expect(compareStrings("b", "a")).toBeGreaterThan(0);
    });
  });

  describe("when the strings are equal", () => {
    it("returns zero", () => {
      expect(compareStrings("a", "a")).toBe(0);
    });
  });

  describe("when used as a sort comparator", () => {
    it("orders the array alphabetically", () => {
      expect(["orc", "agents", "notes"].toSorted(compareStrings)).toEqual([
        "agents",
        "notes",
        "orc",
      ]);
    });
  });
});
