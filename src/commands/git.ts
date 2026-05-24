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

/**
 * Checks whether a local branch named `branch` exists in the repo at `repoPath`.
 *
 * @param repoPath - The path to the git repository.
 * @param branch - The branch name to look for.
 * @returns `true` when the branch exists, otherwise `false`.
 */
export async function branchExists(repoPath: string, branch: string): Promise<boolean> {
  const { exitCode } = await runCommand([
    "git",
    "-C",
    repoPath,
    "show-ref",
    "--verify",
    "--quiet",
    `refs/heads/${branch}`,
  ]);

  return exitCode === 0;
}

/**
 * Creates a git worktree at `worktreePath` with a new branch named `branch` based on `startPoint`.
 *
 * @param repoPath - The path to the git repository.
 * @param worktreePath - The path where the worktree will be created.
 * @param branch - The name of the new branch.
 * @param startPoint - The branch, commit, or tag to base the new branch on.
 * @throws If `git worktree add` fails.
 */
export async function addWorktree(
  repoPath: string,
  worktreePath: string,
  branch: string,
  startPoint: string,
): Promise<void> {
  const { exitCode, stderr } = await runCommand([
    "git",
    "-C",
    repoPath,
    "worktree",
    "add",
    worktreePath,
    "-b",
    branch,
    startPoint,
  ]);

  if (exitCode !== 0) {
    throw new Error(`git worktree add failed: ${stderr.trim()}`);
  }
}

/**
 * Removes the git worktree at `worktreePath`. Forces the removal so untracked or modified files in
 * the worktree do not block deletion. Leaves the branch ref in the main repo untouched.
 *
 * @param repoPath - The path to the git repository.
 * @param worktreePath - The path to the worktree to remove.
 * @throws If `git worktree remove` fails.
 */
export async function removeWorktree(repoPath: string, worktreePath: string): Promise<void> {
  const { exitCode, stderr } = await runCommand([
    "git",
    "-C",
    repoPath,
    "worktree",
    "remove",
    "--force",
    worktreePath,
  ]);

  if (exitCode !== 0) {
    throw new Error(`Failed to remove git worktree: ${stderr.trim()}`);
  }
}
