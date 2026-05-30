import { chunk } from "./chunk.ts";
import { describe, expect, it } from "bun:test";

describe("chunk", () => {
  it("splits an array into chunks of the given size", () => {
    expect(chunk([1, 2, 3, 4, 5, 6], 2)).toEqual([
      [1, 2],
      [3, 4],
      [5, 6],
    ]);
  });

  it("puts the remainder in a final smaller chunk", () => {
    expect(chunk([1, 2, 3, 4, 5], 2)).toEqual([[1, 2], [3, 4], [5]]);
  });

  it("returns an empty array when the input is empty", () => {
    expect(chunk([], 3)).toEqual([]);
  });

  describe("when the size is larger than the array", () => {
    it("returns a single chunk with every element", () => {
      expect(chunk([1, 2], 5)).toEqual([[1, 2]]);
    });
  });
});
