import { exists } from "./exists.ts";
import { describe, expect, it } from "bun:test";

describe("exists", () => {
  describe("when a directory exists at the path", () => {
    it("returns true", async () => {
      expect(await exists(import.meta.dir)).toBe(true);
    });
  });

  describe("when a file exists at the path", () => {
    it("returns true", async () => {
      expect(await exists(import.meta.path)).toBe(true);
    });
  });

  describe("when nothing exists at the path", () => {
    it("returns false", async () => {
      expect(await exists(`${import.meta.dir}/missing-${Date.now()}`)).toBe(false);
    });
  });
});
