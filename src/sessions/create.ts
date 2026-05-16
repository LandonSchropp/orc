import { addWorktree, defaultBranch } from "../commands/git.ts";
import { readTmuxinatorProject, startTmuxinatorProject } from "../commands/tmuxinator.ts";
import { switchSession } from "./switch.ts";
import { mkdir } from "node:fs/promises";
import { homedir } from "node:os";
import { dirname, join } from "node:path";

/**
 * Creates a new orc session. When `worktree` is `true` (the default), makes a Git worktree from the
 * project's default branch and starts the project's Tmuxinator template against it. When `false`,
 * starts Tmuxinator against the project's actual `root` and skips the worktree step.
 *
 * @param project - The name of an existing Tmuxinator project.
 * @param session - The session name within the project.
 * @param options.worktree - Whether to create a Git worktree. Defaults to `true`.
 * @throws If the project's default branch cannot be determined or any underlying operation fails.
 */
export async function createSession(
  project: string,
  session: string,
  { worktree = true }: { worktree?: boolean } = {},
): Promise<void> {
  const { root: repoPath } = await readTmuxinatorProject(project);

  const sessionRoot = worktree ? await createWorktree(repoPath, project, session) : repoPath;

  await startTmuxinatorProject(project, session, sessionRoot);
  await switchSession(project, session);
}

async function createWorktree(repoPath: string, project: string, session: string): Promise<string> {
  const branch = await defaultBranch(repoPath);

  if (!branch) {
    throw new Error(`Could not determine default branch for ${repoPath}`);
  }

  const worktreePath = join(homedir(), ".cache", "orc", "worktrees", project, session);
  await mkdir(dirname(worktreePath), { recursive: true });

  await addWorktree(repoPath, worktreePath, session, branch);
  return worktreePath;
}
