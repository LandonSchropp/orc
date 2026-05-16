import { worktreePath } from "./paths.ts";
import { describe, expect, it } from "bun:test";
import { homedir } from "node:os";

describe("worktreePath", () => {
  it("returns the orc cache path for the given project and session", () => {
    expect(worktreePath("test-project", "feature-a")).toBe(
      `${homedir()}/.cache/orc/worktrees/test-project/feature-a`,
    );
  });
});
