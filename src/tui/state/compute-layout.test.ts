import { computeLayout } from "./compute-layout.ts";
import { describe, expect, it } from "bun:test";

describe("computeLayout", () => {
  describe("when the window fits exactly N columns with minimum margins", () => {
    it("returns N columns with the minimum margins", () => {
      // 2*2 + 3*28 + 2*2 = 92
      expect(computeLayout(92)).toEqual({
        numberOfColumns: 3,
        leftMargin: 2,
        rightMargin: 2,
      });
    });
  });

  describe("when the leftover space splits evenly", () => {
    it("returns equal left and right margins", () => {
      // 92 + 4 leftover → still 3 columns, each margin = 4
      expect(computeLayout(96)).toEqual({
        numberOfColumns: 3,
        leftMargin: 4,
        rightMargin: 4,
      });
    });
  });

  describe("when the leftover space splits unevenly", () => {
    it("gives the extra cell to the left margin", () => {
      // 92 + 1 leftover → still 3 columns, left = 3, right = 2
      expect(computeLayout(93)).toEqual({
        numberOfColumns: 3,
        leftMargin: 3,
        rightMargin: 2,
      });
    });
  });

  describe("when there is room for an additional column", () => {
    it("uses the additional column", () => {
      // 2*2 + 4*28 + 3*2 = 122
      expect(computeLayout(122)).toEqual({
        numberOfColumns: 4,
        leftMargin: 2,
        rightMargin: 2,
      });
    });
  });

  describe("when the window is too small for the minimum margins", () => {
    it("returns one column with zero margins", () => {
      expect(computeLayout(10)).toEqual({
        numberOfColumns: 1,
        leftMargin: 0,
        rightMargin: 0,
      });
    });
  });
});
