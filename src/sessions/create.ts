import { addWorktree, defaultBranch } from "../commands/git.ts";
import { readTmuxinatorProject, startTmuxinatorProject } from "../commands/tmuxinator.ts";
import { switchSession } from "./switch.ts";
import { mkdir } from "node:fs/promises";
import { homedir } from "node:os";
import { dirname, join } from "node:path";

/**
 * Creates a new orc session: makes a Git worktree from the project's default branch, starts the
 * project's Tmuxinator template against the worktree, and switches to the new session.
 *
 * @param project - The name of an existing Tmuxinator project.
 * @param session - The session name within the project.
 * @throws If the project's default branch cannot be determined or any underlying operation fails.
 */
export async function createSession(project: string, session: string): Promise<void> {
  const { root: repoPath } = await readTmuxinatorProject(project);

  const branch = await defaultBranch(repoPath);

  if (!branch) {
    throw new Error(`Could not determine default branch for ${repoPath}`);
  }

  const worktreePath = join(homedir(), ".cache", "orc", "worktrees", project, session);
  await mkdir(dirname(worktreePath), { recursive: true });

  await addWorktree(repoPath, worktreePath, session, branch);
  await startTmuxinatorProject(project, session, worktreePath);
  await switchSession(project, session);
}
