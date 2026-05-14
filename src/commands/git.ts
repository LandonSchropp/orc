import { runCommand } from "./shell.ts";

/**
 * Checks if git is installed and available on PATH.
 *
 * @returns `true` when git is installed, otherwise `false`.
 */
export async function isGitInstalled(): Promise<boolean> {
  return (await runCommand(["git", "--version"])).exitCode === 0;
}

/**
 * Returns the default branch for the repo at `repoPath`. Tries `origin/HEAD` first, then falls back
 * to a local `main` or `master` branch. Returns `null` if no default can be determined.
 *
 * @param repoPath - The path to the git repository.
 * @returns The default branch name, or `null`.
 */
export async function defaultBranch(repoPath: string): Promise<string | null> {
  const originResult = await runCommand([
    "git",
    "-C",
    repoPath,
    "symbolic-ref",
    "refs/remotes/origin/HEAD",
  ]);

  if (originResult.exitCode === 0) {
    return originResult.stdout.trim().split("/").pop() ?? null;
  }

  for (const candidate of ["main", "master"]) {
    const localResult = await runCommand([
      "git",
      "-C",
      repoPath,
      "show-ref",
      "--verify",
      `refs/heads/${candidate}`,
    ]);

    if (localResult.exitCode === 0) return candidate;
  }

  return null;
}
