import { expandHome } from "./directory.ts";
import { describe, expect, it } from "bun:test";
import { homedir } from "node:os";

describe("expandHome", () => {
  describe("when the path starts with `~/`", () => {
    it("replaces the leading `~/` with the home directory", () => {
      expect(expandHome("~/Development/agent-toolkit")).toBe(
        `${homedir()}/Development/agent-toolkit`,
      );
    });
  });

  describe("when the path does not start with `~/`", () => {
    it("returns the path unchanged", () => {
      expect(expandHome("/tmp/worktree")).toBe("/tmp/worktree");
    });
  });
});
