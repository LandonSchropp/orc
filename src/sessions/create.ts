import { addWorktree, branchExists, defaultBranch, worktreeExists } from "../commands/git.ts";
import { startTmuxinatorProject } from "../commands/tmuxinator.ts";
import { DEFAULT_PROJECT } from "../constants.ts";
import type { ProjectSource } from "../types.ts";
import { MAIN_SESSION_NAME } from "./main-worktree.ts";
import { worktreePath } from "./paths.ts";
import { switchSession } from "./switch.ts";
import { mkdir } from "node:fs/promises";
import { dirname } from "node:path";

/**
 * Creates a new orc session. The session named "main" runs on the project's main worktree; every
 * other session gets a dedicated Git worktree — reusing an existing worktree if present, checking
 * out the session's branch when it already exists, or branching from the project's default branch
 * when it does not. Starts tmuxinator against the chosen directory — a tmuxinator source uses its
 * own template, a directory source uses the `default` template — then switches to the new session.
 *
 * @param source The project to create the session in.
 * @param session The session name within the project.
 * @throws If the project's default branch cannot be determined or any underlying operation fails.
 */
export async function createSession(source: ProjectSource, session: string): Promise<void> {
  const sessionDirectory =
    session === MAIN_SESSION_NAME
      ? source.root
      : await createWorktree(source.root, source.name, session);

  if (source.kind === "directory") {
    await startTmuxinatorProject(source.name, session, sessionDirectory, DEFAULT_PROJECT);
  } else {
    await startTmuxinatorProject(source.name, session, sessionDirectory);
  }

  await switchSession(source.name, session);
}

/**
 * Creates the session's Git worktree if it does not already exist.
 *
 * @param repoPath The path to the project's main repository.
 * @param project The project name.
 * @param session The session name within the project.
 * @returns The absolute path to the session's worktree.
 */
async function createWorktree(repoPath: string, project: string, session: string): Promise<string> {
  const path = worktreePath(project, session);

  if (await worktreeExists(repoPath, path)) {
    return path;
  }

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
