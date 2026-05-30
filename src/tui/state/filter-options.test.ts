import { filterOptions } from "./filter-options.ts";
import { describe, expect, it } from "bun:test";

describe("filterOptions", () => {
  describe("when the query is empty", () => {
    it("returns every option in original order", () => {
      expect(filterOptions(["apple", "banana", "cherry"], "")).toEqual([
        "apple",
        "banana",
        "cherry",
      ]);
    });
  });

  describe("when the query fuzzy-matches some options", () => {
    it("returns only matching options", () => {
      const result = filterOptions(["apple", "cherry", "date"], "a");

      expect(result).toContain("apple");
      expect(result).toContain("date");
      expect(result).not.toContain("cherry");
    });
  });

  describe("when the query has different casing than the options", () => {
    it("matches case-insensitively", () => {
      const result = filterOptions(["Apple", "Banana"], "BAN");

      expect(result).toEqual(["Banana"]);
    });
  });

  describe("when no options match", () => {
    it("returns an empty list", () => {
      expect(filterOptions(["apple", "banana"], "zzz")).toEqual([]);
    });
  });
});
