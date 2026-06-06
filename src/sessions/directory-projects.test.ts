import { projectSourceFactory } from "../../test/factories/project-source.ts";
import { listDirectoryProjects } from "./directory-projects.ts";
import { afterEach, beforeEach, describe, expect, it } from "bun:test";
import { mkdir, rm } from "node:fs/promises";
import { join } from "node:path";

const base = "/tmp/orc-test-directory-projects";

/**
 * Creates a directory under `base` with a `.git` entry so it registers as a git repository.
 *
 * @param name The repository directory name.
 */
async function createRepo(name: string): Promise<void> {
  await mkdir(join(base, name, ".git"), { recursive: true });
}

/**
 * Builds a tmuxinator project source with the given name, used to exclude already-configured repos.
 *
 * @param name The tmuxinator project name.
 * @returns The tmuxinator source.
 */
function tmuxinatorSource(name: string) {
  return projectSourceFactory.build({ name });
}

describe("listDirectoryProjects", () => {
  beforeEach(async () => {
    await rm(base, { recursive: true, force: true });
    await mkdir(base, { recursive: true });
  });

  afterEach(async () => {
    await rm(base, { recursive: true, force: true });
  });

  describe("when a project path matches git repos", () => {
    beforeEach(async () => {
      await createRepo("agent-toolkit");
      await createRepo("orc");
      await createRepo("notes");
    });

    it("returns the repos that are not already tmuxinator projects", async () => {
      const projects = await listDirectoryProjects(
        [`${base}/*`],
        [tmuxinatorSource("agent-toolkit")],
      );

      expect(projects.toSorted((a, b) => a.name.localeCompare(b.name))).toEqual([
        { kind: "directory", name: "notes", repositoryRoot: join(base, "notes") },
        { kind: "directory", name: "orc", repositoryRoot: join(base, "orc") },
      ]);
    });
  });

  describe("when a matched directory is not a git repo", () => {
    beforeEach(async () => {
      await createRepo("agent-toolkit");
      await mkdir(join(base, "not-a-repo"), { recursive: true });
    });

    it("excludes the non-repo directory", async () => {
      expect(
        await listDirectoryProjects([`${base}/*`], [tmuxinatorSource("agent-toolkit")]),
      ).toEqual([]);
    });
  });

  describe("when a project path does not exist", () => {
    beforeEach(async () => {
      await createRepo("orc");
    });

    it("ignores the missing path and still returns repos from the others", async () => {
      expect(
        await listDirectoryProjects(["/tmp/orc-test-directory-projects-gone/*", `${base}/*`], []),
      ).toEqual([{ kind: "directory", name: "orc", repositoryRoot: join(base, "orc") }]);
    });
  });

  describe("when there are no project paths", () => {
    it("returns an empty array", async () => {
      expect(await listDirectoryProjects([], [])).toEqual([]);
    });
  });
});
