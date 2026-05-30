import { computeScrollOffset } from "./compute-scroll-offset.ts";
import { describe, expect, it } from "bun:test";

describe("computeScrollOffset", () => {
  describe("when the selection sits within the viewport", () => {
    it("keeps the offset", () => {
      expect(computeScrollOffset(4, 8, 4, 20, 4)).toBe(4);
    });
  });

  describe("when the selection reaches the bottom margin", () => {
    it("scrolls down to keep the margin below it visible", () => {
      expect(computeScrollOffset(0, 16, 4, 20, 4)).toBe(4);
    });
  });

  describe("when the selection reaches the top margin", () => {
    it("scrolls up to keep the margin above it visible", () => {
      expect(computeScrollOffset(8, 8, 4, 20, 4)).toBe(4);
    });
  });

  describe("when the selection is at the very top", () => {
    it("clamps the offset to zero", () => {
      expect(computeScrollOffset(4, 0, 4, 20, 4)).toBe(0);
    });
  });

  describe("when reversing direction within the viewport", () => {
    it("does not scroll until the selection reaches the opposite margin", () => {
      expect(computeScrollOffset(8, 16, 4, 20, 4)).toBe(8);
    });
  });
});
