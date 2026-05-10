import { runCommand } from "./shell.ts";

/**
 * Checks if tmuxinator is installed and available on PATH.
 *
 * @returns `true` when tmuxinator is installed, otherwise `false`.
 */
export async function isTmuxinatorInstalled(): Promise<boolean> {
  return (await runCommand(["tmuxinator", "version"])).exitCode === 0;
}
