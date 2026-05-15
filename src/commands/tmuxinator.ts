import type { YamlObject } from "../types.ts";
import { runCommand } from "./shell.ts";
import { YAML } from "bun";

/**
 * Checks if tmuxinator is installed and available on PATH.
 *
 * @returns `true` when tmuxinator is installed, otherwise `false`.
 */
export async function isTmuxinatorInstalled(): Promise<boolean> {
  return (await runCommand(["tmuxinator", "version"])).exitCode === 0;
}

/**
 * Lists the available tmuxinator project names. Drops the `tmuxinator projects:` header that
 * `tmuxinator list --newline` prints before the names.
 *
 * @returns The available tmuxinator project names.
 */
export async function listTmuxinatorProjects(): Promise<string[]> {
  const { stdout } = await runCommand(["tmuxinator", "list", "--newline"]);

  return stdout
    .split("\n")
    .slice(1)
    .filter((line) => line.length > 0);
}

/**
 * Reads and parses a tmuxinator project YAML at the given path.
 *
 * @param path - The path to the tmuxinator YAML file.
 * @returns The parsed tmuxinator project.
 * @throws If the file cannot be read, the YAML is invalid, or the project is missing a string
 *   `root` field.
 */
export async function readTmuxinatorProject(path: string): Promise<YamlObject> {
  const project = YAML.parse(await Bun.file(path).text()) as YamlObject;

  if (typeof project?.root !== "string") {
    throw new Error(`Tmuxinator config at ${path} is missing a string \`root\` field`);
  }

  return project;
}

/**
 * Starts a tmuxinator project with the given `root` overridden and a custom session name. Writes a
 * modified copy of the project's YAML to a temp file before invoking tmuxinator. Does not attach
 * the calling process to the session — callers attach separately.
 *
 * @param project - The tmuxinator project to start.
 * @param root - The root directory to override in the project config.
 * @param sessionName - The tmux session name to use.
 * @throws If tmuxinator fails to start the project.
 */
export async function startTmuxinatorProject(
  project: YamlObject,
  root: string,
  sessionName: string,
): Promise<void> {
  const configPath = `/tmp/orc-${sessionName.replace(/:/g, "-")}.yml`;
  await Bun.write(configPath, YAML.stringify({ ...project, root }, null, 2));

  const { exitCode, stderr } = await runCommand([
    "tmuxinator",
    "start",
    "-p",
    configPath,
    "-n",
    sessionName,
    "--no-attach",
  ]);

  if (exitCode !== 0) {
    throw new Error(`tmuxinator start failed: ${stderr.trim()}`);
  }
}
