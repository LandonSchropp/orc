import { DURATION_OVERFLOW, formatDuration } from "./format-duration.ts";
import { describe, expect, it } from "bun:test";

describe("formatDuration", () => {
  describe("when the duration is zero", () => {
    it("formats as 00:00", () => {
      expect(formatDuration(0)).toBe("00:00");
    });
  });

  describe("when the duration is under a minute", () => {
    it("zero-pads the minutes and seconds", () => {
      expect(formatDuration(42_000)).toBe("00:42");
    });
  });

  describe("when the duration spans minutes", () => {
    it("formats the minutes and seconds", () => {
      expect(formatDuration(65_000)).toBe("01:05");
    });
  });

  describe("when the duration is negative", () => {
    it("clamps to 00:00", () => {
      expect(formatDuration(-5_000)).toBe("00:00");
    });
  });

  describe("when the minutes still fit two digits", () => {
    it("formats as 99:59", () => {
      expect(formatDuration(99 * 60_000 + 59_000)).toBe("99:59");
    });
  });

  describe("when the minutes exceed two digits", () => {
    it("returns the overflow indicator", () => {
      expect(formatDuration(100 * 60_000)).toBe(DURATION_OVERFLOW);
    });
  });
});
