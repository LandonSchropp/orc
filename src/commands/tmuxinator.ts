import { runCommand } from "./shell.ts";

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
