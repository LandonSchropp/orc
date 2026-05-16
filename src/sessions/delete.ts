import { removeWorktree } from "../commands/git.ts";
import { detachTmuxClient, killTmuxSession, tmuxSessionName } from "../commands/tmux.ts";
import { readTmuxinatorProject } from "../commands/tmuxinator.ts";
import { getCurrentSession } from "./current.ts";
import { worktreePath } from "./paths.ts";
import { existsSync } from "node:fs";

/**
 * Deletes an orc session. Detaches the tmux client first if it is attached to the target session,
 * then removes the Git worktree (if one exists at the orc cache path) and kills the tmux session.
 * Does not delete the underlying branch.
 *
 * @param project - The project name.
 * @param session - The session name within the project.
 */
export async function deleteSession(project: string, session: string): Promise<void> {
  const current = await getCurrentSession();

  if (current?.project === project && current?.session === session) {
    await detachTmuxClient();
  }

  const path = worktreePath(project, session);

  if (existsSync(path)) {
    const { root: repoPath } = await readTmuxinatorProject(project);
    await removeWorktree(repoPath, path);
  }

  await killTmuxSession(tmuxSessionName(project, session));
}
