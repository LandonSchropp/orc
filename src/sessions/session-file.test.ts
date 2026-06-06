import { stubEnv } from "../../test/helpers/env.ts";
import type { SessionInfo } from "../types.ts";
import {
  listSessionFiles,
  readSessionFile,
  removeSessionFile,
  sessionFileExists,
  sessionFilePath,
  writeSessionFile,
} from "./session-file.ts";
import { afterEach, beforeEach, describe, expect, it } from "bun:test";
import { rm } from "node:fs/promises";

const cacheHome = "/tmp/orc-test-session-file";

const info: SessionInfo = {
  project: "test-project",
  session: "feature-a",
  id: "test-project/feature-a",
  kind: "tmuxinator",
  repositoryRoot: "/repos/test-project",
  createdAt: new Date("2026-06-06T18:00:00.000Z"),
};

beforeEach(() => {
  stubEnv("XDG_CACHE_HOME", cacheHome);
});

afterEach(async () => {
  await rm(cacheHome, { recursive: true, force: true });
});

describe("sessionFilePath", () => {
  it("returns a flat path encoding project and session", () => {
    expect(sessionFilePath("test-project", "feature-a")).toBe(
      `${cacheHome}/orc/state/test-project:feature-a.json`,
    );
  });
});

describe("writeSessionFile", () => {
  it("writes the session info as its stored shape, creating the state directory", async () => {
    await writeSessionFile(info);

    const written = await Bun.file(`${cacheHome}/orc/state/test-project:feature-a.json`).json();

    expect(written).toEqual({
      project: "test-project",
      session: "feature-a",
      kind: "tmuxinator",
      repositoryRoot: "/repos/test-project",
      createdAt: "2026-06-06T18:00:00.000Z",
    });
  });
});

describe("readSessionFile", () => {
  describe("when the file exists", () => {
    beforeEach(async () => {
      await writeSessionFile(info);
    });

    it("returns the session info with a derived id and a parsed date", async () => {
      expect(await readSessionFile("test-project", "feature-a")).toEqual(info);
    });
  });

  describe("when the file does not exist", () => {
    it("returns null", async () => {
      expect(await readSessionFile("test-project", "feature-a")).toBeNull();
    });
  });

  describe("when the file has an invalid shape", () => {
    beforeEach(async () => {
      await Bun.write(
        `${cacheHome}/orc/state/test-project:feature-a.json`,
        JSON.stringify({ project: "test-project" }),
      );
    });

    it("throws an error", () => {
      expect(readSessionFile("test-project", "feature-a")).rejects.toThrow();
    });
  });
});

describe("sessionFileExists", () => {
  describe("when the file exists", () => {
    beforeEach(async () => {
      await writeSessionFile(info);
    });

    it("returns true", async () => {
      expect(await sessionFileExists("test-project", "feature-a")).toBe(true);
    });
  });

  describe("when the file does not exist", () => {
    it("returns false", async () => {
      expect(await sessionFileExists("test-project", "feature-a")).toBe(false);
    });
  });
});

describe("listSessionFiles", () => {
  describe("when there are session and pane files", () => {
    beforeEach(async () => {
      await writeSessionFile(info);
      await writeSessionFile({ ...info, session: "feature-b", id: "test-project/feature-b" });
      await Bun.write(
        `${cacheHome}/orc/state/test-project:feature-a:%5.json`,
        JSON.stringify({ status: "Idle", timestamp: "2026-06-06T18:00:00.000Z" }),
      );
    });

    it("returns the info for each session file, ignoring pane files", async () => {
      const sessions = await listSessionFiles();

      expect(sessions.map((session) => session.session).toSorted()).toEqual([
        "feature-a",
        "feature-b",
      ]);
    });
  });

  describe("when there are no session files", () => {
    it("returns an empty array", async () => {
      expect(await listSessionFiles()).toEqual([]);
    });
  });
});

describe("removeSessionFile", () => {
  describe("when the file exists", () => {
    beforeEach(async () => {
      await writeSessionFile(info);
    });

    it("removes the file", async () => {
      await removeSessionFile("test-project", "feature-a");

      expect(await Bun.file(`${cacheHome}/orc/state/test-project:feature-a.json`).exists()).toBe(
        false,
      );
    });
  });

  describe("when the file does not exist", () => {
    it("does not throw", async () => {
      await removeSessionFile("test-project", "feature-a");
    });
  });
});
