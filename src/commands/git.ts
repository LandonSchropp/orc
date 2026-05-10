import { runCommand } from "./shell.ts";

/**
 * Checks if git is installed and available on PATH.
 *
 * @returns `true` when git is installed, otherwise `false`.
 */
export async function isGitInstalled(): Promise<boolean> {
  return (await runCommand(["git", "--version"])).exitCode === 0;
}
