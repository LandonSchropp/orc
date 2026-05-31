import { stubEnv } from "../../test/helpers/env.ts";
import { isDeleteWorker, spawnDeleteWorker } from "./delete-worker.ts";
import { beforeEach, describe, expect, it, mock } from "bun:test";
import { homedir } from "node:os";

const runDetachedCommandMock = mock((): void => {});

await mock.module("../commands/shell.ts", () => ({
  runDetachedCommand: runDetachedCommandMock,
}));

beforeEach(() => {
  stubEnv("ORC_INTERNAL_DELETE_WORKER", undefined);
});

describe("isDeleteWorker", () => {
  describe("when the worker flag is set", () => {
    it("returns true", () => {
      stubEnv("ORC_INTERNAL_DELETE_WORKER", "1");
      expect(isDeleteWorker()).toBe(true);
    });
  });

  describe("when the worker flag is not set", () => {
    it("returns false", () => {
      stubEnv("ORC_INTERNAL_DELETE_WORKER", undefined);
      expect(isDeleteWorker()).toBe(false);
    });
  });
});

describe("spawnDeleteWorker", () => {
  it("spawns a detached `orc delete` in the home directory with the worker flag set", () => {
    spawnDeleteWorker("orc", "tui");

    expect(runDetachedCommandMock).toHaveBeenCalledWith(
      [process.execPath, process.argv[1], "delete", "orc", "tui"],
      { cwd: homedir(), env: { ORC_INTERNAL_DELETE_WORKER: "1" } },
    );
  });
});
