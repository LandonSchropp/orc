import { stubEnv } from "../../test/helpers/env.ts";
import {
  isTmuxinatorInstalled,
  listTmuxinatorProjects,
  readTmuxinatorProject,
  startTmuxinatorProject,
  tmuxinatorConfigPath,
} from "./tmuxinator.ts";
import { YAML } from "bun";
import { afterEach, beforeEach, describe, expect, it, mock } from "bun:test";
import { rm } from "node:fs/promises";
import { homedir } from "node:os";
import { dedent } from "ts-dedent";

const configHome = "/tmp/orc-test-config";

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

describe("tmuxinatorConfigPath", () => {
  describe("when $XDG_CONFIG_HOME is set", () => {
    beforeEach(() => {
      stubEnv("XDG_CONFIG_HOME", configHome);
    });

    it("returns the project YAML under $XDG_CONFIG_HOME/tmuxinator", () => {
      expect(tmuxinatorConfigPath("agent-toolkit")).toBe(
        `${configHome}/tmuxinator/agent-toolkit.yml`,
      );
    });
  });

  describe("when $XDG_CONFIG_HOME is not set", () => {
    beforeEach(() => {
      stubEnv("XDG_CONFIG_HOME", undefined);
    });

    it("returns the project YAML under ~/.config/tmuxinator", () => {
      expect(tmuxinatorConfigPath("agent-toolkit")).toBe(
        `${homedir()}/.config/tmuxinator/agent-toolkit.yml`,
      );
    });
  });
});

describe("readTmuxinatorProject", () => {
  const configPath = `${configHome}/tmuxinator/agent-toolkit.yml`;

  beforeEach(() => {
    stubEnv("XDG_CONFIG_HOME", configHome);
  });

  afterEach(async () => {
    await rm(configHome, { recursive: true, force: true });
  });

  describe("when the file contains a valid YAML config", () => {
    beforeEach(async () => {
      await Bun.write(
        configPath,
        dedent`
          name: agent-toolkit
          root: ~/Development/agent-toolkit
          windows:
            - shell:
            - vim: nvim
        `,
      );
    });

    it("parses the project and expands `~/` in `root`", async () => {
      expect(await readTmuxinatorProject("agent-toolkit")).toEqual({
        name: "agent-toolkit",
        root: `${homedir()}/Development/agent-toolkit`,
        windows: [{ shell: null }, { vim: "nvim" }],
      });
    });
  });

  describe("when the file does not exist", () => {
    it("throws an error", () => {
      expect(readTmuxinatorProject("agent-toolkit")).rejects.toThrow();
    });
  });

  describe("when the YAML is malformed", () => {
    beforeEach(async () => {
      await Bun.write(configPath, "name: agent-toolkit\nroot: [unclosed\n");
    });

    it("throws an error", () => {
      expect(readTmuxinatorProject("agent-toolkit")).rejects.toThrow();
    });
  });

  describe("when the project is missing a name field", () => {
    beforeEach(async () => {
      await Bun.write(configPath, "root: ~/Development/agent-toolkit\n");
    });

    it("throws an error", () => {
      expect(readTmuxinatorProject("agent-toolkit")).rejects.toThrow(/missing a string `name`/);
    });
  });

  describe("when the project is missing a root field", () => {
    beforeEach(async () => {
      await Bun.write(configPath, "name: agent-toolkit\n");
    });

    it("throws an error", () => {
      expect(readTmuxinatorProject("agent-toolkit")).rejects.toThrow(/missing a string `root`/);
    });
  });
});

describe("startTmuxinatorProject", () => {
  const configPath = "/tmp/orc-agent-toolkit-feature-a.yml";

  beforeEach(async () => {
    stubEnv("XDG_CONFIG_HOME", configHome);
    await Bun.write(
      `${configHome}/tmuxinator/agent-toolkit.yml`,
      dedent`
        name: agent-toolkit
        root: ~/Development/agent-toolkit
        tmux_options: -L orc
      `,
    );
  });

  afterEach(async () => {
    await rm(configHome, { recursive: true, force: true });
    await rm(configPath, { force: true });
  });

  describe("when tmuxinator succeeds", () => {
    beforeEach(() => {
      runCommandMock.mockResolvedValue({ exitCode: 0, stdout: "", stderr: "" });
    });

    it("writes a modified config with the overridden root and invokes `tmuxinator start`", async () => {
      await startTmuxinatorProject("agent-toolkit", "feature-a", "/tmp/worktree");

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
      expect(startTmuxinatorProject("agent-toolkit", "feature-a", "/tmp/worktree")).rejects.toThrow(
        /could not start tmuxinator/,
      );
    });
  });
});
