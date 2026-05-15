import {
  isTmuxinatorInstalled,
  listTmuxinatorProjects,
  readTmuxinatorProject,
  startTmuxinatorProject,
} from "./tmuxinator.ts";
import { YAML } from "bun";
import { afterEach, beforeEach, describe, expect, it, mock } from "bun:test";
import { rm } from "node:fs/promises";
import { dedent } from "ts-dedent";

const runCommandMock = mock(() => Promise.resolve({ exitCode: 0, stdout: "", stderr: "" }));

await mock.module("./shell.ts", () => ({
  runCommand: runCommandMock,
}));

describe("isTmuxinatorInstalled", () => {
  describe("when tmuxinator is available", () => {
    it("returns true", async () => {
      runCommandMock.mockResolvedValue({ exitCode: 0, stdout: "", stderr: "" });
      expect(await isTmuxinatorInstalled()).toBe(true);
    });
  });

  describe("when tmuxinator is not available", () => {
    it("returns false", async () => {
      runCommandMock.mockResolvedValue({ exitCode: 1, stdout: "", stderr: "" });
      expect(await isTmuxinatorInstalled()).toBe(false);
    });
  });

  describe("when tmuxinator is not installed", () => {
    it("returns false", async () => {
      runCommandMock.mockResolvedValue({ exitCode: 127, stdout: "", stderr: "" });
      expect(await isTmuxinatorInstalled()).toBe(false);
    });
  });
});

describe("listTmuxinatorProjects", () => {
  describe("when projects exist", () => {
    it("returns the project names without the header", async () => {
      runCommandMock.mockResolvedValue({
        exitCode: 0,
        stdout: "tmuxinator projects:\nagent-toolkit\ndotfiles\nnotes\n",
        stderr: "",
      });
      expect(await listTmuxinatorProjects()).toEqual(["agent-toolkit", "dotfiles", "notes"]);
    });
  });

  describe("when no projects exist", () => {
    it("returns an empty array", async () => {
      runCommandMock.mockResolvedValue({
        exitCode: 0,
        stdout: "tmuxinator projects:\n",
        stderr: "",
      });
      expect(await listTmuxinatorProjects()).toEqual([]);
    });
  });
});

describe("readTmuxinatorProject", () => {
  describe("when the file contains a valid YAML config", () => {
    const path = "/tmp/orc-test-read-valid.yml";

    beforeEach(async () => {
      await Bun.write(
        path,
        dedent`
          name: agent-toolkit
          root: ~/Development/agent-toolkit
          windows:
            - shell:
            - vim: nvim
        `,
      );
    });

    afterEach(async () => {
      await rm(path);
    });

    it("parses and returns the project", async () => {
      expect(await readTmuxinatorProject(path)).toEqual({
        name: "agent-toolkit",
        root: "~/Development/agent-toolkit",
        windows: [{ shell: null }, { vim: "nvim" }],
      });
    });
  });

  describe("when the file does not exist", () => {
    it("throws", () => {
      expect(readTmuxinatorProject("/tmp/orc-test-read-nonexistent.yml")).rejects.toThrow();
    });
  });

  describe("when the YAML is malformed", () => {
    const path = "/tmp/orc-test-read-malformed.yml";

    beforeEach(async () => {
      await Bun.write(path, "name: agent-toolkit\nroot: [unclosed\n");
    });

    afterEach(async () => {
      await rm(path);
    });

    it("throws", () => {
      expect(readTmuxinatorProject(path)).rejects.toThrow();
    });
  });

  describe("when the project is missing a root field", () => {
    const path = "/tmp/orc-test-read-no-root.yml";

    beforeEach(async () => {
      await Bun.write(path, "name: agent-toolkit\n");
    });

    afterEach(async () => {
      await rm(path);
    });

    it("throws", () => {
      expect(readTmuxinatorProject(path)).rejects.toThrow(/missing a string `root`/);
    });
  });
});

describe("startTmuxinatorProject", () => {
  const configPath = "/tmp/orc-agent-toolkit-feature-a.yml";

  afterEach(async () => {
    await rm(configPath, { force: true });
  });

  describe("when tmuxinator succeeds", () => {
    beforeEach(() => {
      runCommandMock.mockResolvedValue({ exitCode: 0, stdout: "", stderr: "" });
    });

    it("writes a modified config with the overridden root and invokes `tmuxinator start`", async () => {
      await startTmuxinatorProject(
        { name: "agent-toolkit", root: "~/Development/agent-toolkit", tmux_options: "-L orc" },
        "/tmp/worktree",
        "agent-toolkit:feature-a",
      );

      expect(runCommandMock).toHaveBeenCalledWith([
        "tmuxinator",
        "start",
        "-p",
        configPath,
        "-n",
        "agent-toolkit:feature-a",
        "--no-attach",
      ]);

      expect(YAML.parse(await Bun.file(configPath).text())).toEqual({
        name: "agent-toolkit",
        root: "/tmp/worktree",
        tmux_options: "-L orc",
      });
    });
  });

  describe("when tmuxinator fails", () => {
    beforeEach(() => {
      runCommandMock.mockResolvedValue({
        exitCode: 1,
        stdout: "",
        stderr: "could not start tmuxinator\n",
      });
    });

    it("throws an error with the stderr message", () => {
      expect(
        startTmuxinatorProject(
          { name: "agent-toolkit", root: "~/Development/agent-toolkit" },
          "/tmp/worktree",
          "agent-toolkit:feature-a",
        ),
      ).rejects.toThrow(/could not start tmuxinator/);
    });
  });
});
