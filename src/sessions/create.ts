import { addWorktree, branchExists, defaultBranch } from "../commands/git.ts";
import { readTmuxinatorProject, startTmuxinatorProject } from "../commands/tmuxinator.ts";
import { isMainWorktreeInUse } from "./main-worktree.ts";
import { worktreePath } from "./paths.ts";
import { switchSession } from "./switch.ts";
import { mkdir } from "node:fs/promises";
import { dirname } from "node:path";

/**
 * Creates a new orc session. Runs on the project's main worktree when no active session for the
 * project is using it; otherwise creates a linked Git worktree from the project's default branch.
 * Starts the project's Tmuxinator template against the chosen directory and switches to it.
 *
 * @param project - The name of an existing Tmuxinator project.
 * @param session - The session name within the project.
 * @throws If the project's default branch cannot be determined or any underlying operation fails.
 */
export async function createSession(project: string, session: string): Promise<void> {
  const { root: mainDirectory } = await readTmuxinatorProject(project);

  const sessionDirectory = (await isMainWorktreeInUse(project))
    ? await createWorktree(mainDirectory, project, session)
    : mainDirectory;

  await startTmuxinatorProject(project, session, sessionDirectory);
  await switchSession(project, session);
}

async function createWorktree(repoPath: string, project: string, session: string): Promise<string> {
  const path = worktreePath(project, session);
  await mkdir(dirname(path), { recursive: true });

  if (await branchExists(repoPath, session)) {
    await addWorktree(repoPath, path, session);
    return path;
  }

  const branch = await defaultBranch(repoPath);

  if (!branch) {
    throw new Error(`Could not determine default branch for ${repoPath}`);
  }

  await addWorktree(repoPath, path, session, branch);
  return path;
}
