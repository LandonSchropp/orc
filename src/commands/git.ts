import { runCommand } from "./shell.ts";
import { dirname } from "node:path";

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
 * @param repoPath The path to the git repository.
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
 * @param repoPath The path to the git repository.
 * @param branch The branch name to look for.
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
 * Returns the root of the repository's main worktree for the worktree at `worktreePath`. Resolves
 * the common git directory and returns its parent, so any linked worktree maps back to the
 * repository it belongs to without needing a project config.
 *
 * @param worktreePath The path to any worktree of the repository.
 * @returns The absolute path to the repository's main worktree root.
 * @throws If git cannot resolve the common directory (e.g. the path is not a worktree).
 */
export async function mainWorktreeRoot(worktreePath: string): Promise<string> {
  const { exitCode, stdout, stderr } = await runCommand([
    "git",
    "-C",
    worktreePath,
    "rev-parse",
    "--path-format=absolute",
    "--git-common-dir",
  ]);

  if (exitCode !== 0) {
    throw new Error(`git rev-parse failed: ${stderr.trim()}`);
  }

  return dirname(stdout.trim());
}

/**
 * Checks whether a git worktree is registered at `worktreePath` for the repo at `repoPath`.
 *
 * @param repoPath The path to the git repository.
 * @param worktreePath The worktree path to look for.
 * @returns `true` when a worktree is registered at the path, otherwise `false`.
 */
export async function worktreeExists(repoPath: string, worktreePath: string): Promise<boolean> {
  const { stdout } = await runCommand(["git", "-C", repoPath, "worktree", "list", "--porcelain"]);

  return stdout.split("\n").some((line) => line === `worktree ${worktreePath}`);
}

/**
 * Creates a git worktree at `worktreePath` for the branch named `branch`. When `baseBranch` is
 * given, creates a new branch based on it; otherwise checks out the existing `branch`.
 *
 * @param repoPath The path to the git repository.
 * @param worktreePath The path where the worktree will be created.
 * @param branch The name of the branch to check out in the worktree.
 * @param baseBranch The branch to base a new branch on. Omit to check out an existing branch.
 * @throws If `git worktree add` fails.
 */
export async function addWorktree(
  repoPath: string,
  worktreePath: string,
  branch: string,
  baseBranch?: string,
): Promise<void> {
  const branchArguments = baseBranch === undefined ? [branch] : ["-b", branch, baseBranch];

  const { exitCode, stderr } = await runCommand([
    "git",
    "-C",
    repoPath,
    "worktree",
    "add",
    worktreePath,
    ...branchArguments,
  ]);

  if (exitCode !== 0) {
    throw new Error(`git worktree add failed: ${stderr.trim()}`);
  }
}

/**
 * Removes the git worktree at `worktreePath`. Forces the removal so untracked or modified files in
 * the worktree do not block deletion. Leaves the branch ref in the main repo untouched.
 *
 * @param repoPath The path to the git repository.
 * @param worktreePath The path to the worktree to remove.
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
