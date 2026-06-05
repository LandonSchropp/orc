import { safeGlob } from "./glob.ts";
import { Glob } from "bun";
import { afterEach, beforeEach, describe, expect, it, spyOn } from "bun:test";
import { mkdir, rm } from "node:fs/promises";
import { join } from "node:path";

const base = "/tmp/orc-test-safe-glob";

describe("safeGlob", () => {
  beforeEach(async () => {
    await rm(base, { recursive: true, force: true });
    await mkdir(base, { recursive: true });
  });

  afterEach(async () => {
    await rm(base, { recursive: true, force: true });
  });

  describe("when the pattern matches paths", () => {
    beforeEach(async () => {
      await mkdir(join(base, "a"), { recursive: true });
      await mkdir(join(base, "b"), { recursive: true });
    });

    it("returns the matching paths", async () => {
      const matches = await safeGlob(join(base, "*"), { absolute: true, onlyFiles: false });

      expect(matches.toSorted()).toEqual([join(base, "a"), join(base, "b")]);
    });
  });

  describe("when nothing matches", () => {
    it("returns an empty array", async () => {
      expect(await safeGlob(join(base, "*"), { onlyFiles: false })).toEqual([]);
    });
  });

  describe("when the base directory is missing", () => {
    it("returns an empty array", async () => {
      expect(await safeGlob(join(base, "missing", "*"), { onlyFiles: false })).toEqual([]);
    });
  });

  describe("when the scan fails for another reason", () => {
    it("rethrows the error", () => {
      spyOn(Glob.prototype, "scan").mockImplementationOnce(() => {
        throw Object.assign(new Error("kaboom"), { code: "EUNEXPECTED" });
      });

      expect(safeGlob(join(base, "*"))).rejects.toThrow("kaboom");
    });
  });
});
