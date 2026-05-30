import { contentWidth } from "./content-width.ts";
import { describe, expect, it } from "bun:test";

describe("contentWidth", () => {
  describe("when there is a single column", () => {
    it("has no gutters", () => {
      expect(contentWidth(1)).toBe(28);
    });
  });

  describe("when there are multiple columns", () => {
    it("sums the column widths and the gutters between them", () => {
      // 3 columns: 3*28 + 2*2 = 88
      expect(contentWidth(3)).toBe(88);
    });
  });
});
