import { stubEnv } from "../../test/helpers/env.ts";
import { AgentState } from "../types.ts";
import { readStateFile, stateFilePath, writeStateFile } from "./state.ts";
import { afterEach, beforeEach, describe, expect, it } from "bun:test";
import { rm } from "node:fs/promises";

const cacheHome = "/tmp/orc-test-state";

beforeEach(() => {
  stubEnv("XDG_CACHE_HOME", cacheHome);
});

afterEach(async () => {
  await rm(cacheHome, { recursive: true, force: true });
});

describe("stateFilePath", () => {
  it("returns the path under the orc cache state directory", () => {
    expect(stateFilePath("test-project:feature-a", "%5")).toBe(
      `${cacheHome}/orc/state/test-project:feature-a/%5.json`,
    );
  });
});

describe("writeStateFile", () => {
  describe("when the parent directory does not exist", () => {
    it("creates parent directories and writes the file", async () => {
      await writeStateFile("test-project:feature-a", "%5", "Working");

      const written = (await Bun.file(
        `${cacheHome}/orc/state/test-project:feature-a/%5.json`,
      ).json()) as unknown as AgentState;

      expect(written.status).toBe("Working");
      expect(typeof written.timestamp).toBe("string");
    });
  });

  it("records an ISO 8601 timestamp", async () => {
    await writeStateFile("test-project:feature-a", "%5", "Idle");

    const written = (await Bun.file(
      `${cacheHome}/orc/state/test-project:feature-a/%5.json`,
    ).json()) as unknown as AgentState;

    expect(written.timestamp).toMatch(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/);
  });

  describe("when the file already exists", () => {
    beforeEach(async () => {
      await writeStateFile("test-project:feature-a", "%5", "Working");
    });

    it("overwrites the existing state", async () => {
      await writeStateFile("test-project:feature-a", "%5", "Idle");

      const written = (await Bun.file(
        `${cacheHome}/orc/state/test-project:feature-a/%5.json`,
      ).json()) as unknown as AgentState;

      expect(written.status).toBe("Idle");
    });
  });
});

describe("readStateFile", () => {
  describe("when the file exists", () => {
    beforeEach(async () => {
      await writeStateFile("test-project:feature-a", "%5", "Waiting");
    });

    it("returns the parsed state", async () => {
      const state = await readStateFile("test-project:feature-a", "%5");
      expect(state?.status).toBe("Waiting");
      expect(typeof state?.timestamp).toBe("string");
    });
  });

  describe("when the file does not exist", () => {
    it("returns null", async () => {
      expect(await readStateFile("test-project:feature-a", "%5")).toBeNull();
    });
  });

  describe("when the file is malformed JSON", () => {
    beforeEach(async () => {
      await Bun.write(`${cacheHome}/orc/state/test-project:feature-a/%5.json`, "{not valid json");
    });

    it("throws an error", () => {
      expect(readStateFile("test-project:feature-a", "%5")).rejects.toThrow();
    });
  });

  describe("when the file has an invalid shape", () => {
    beforeEach(async () => {
      await Bun.write(
        `${cacheHome}/orc/state/test-project:feature-a/%5.json`,
        JSON.stringify({ status: "Bogus", timestamp: "2026-05-17T00:00:00.000Z" }),
      );
    });

    it("throws an error", () => {
      expect(readStateFile("test-project:feature-a", "%5")).rejects.toThrow(/invalid/i);
    });
  });
});
