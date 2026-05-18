import { removeWorktree } from "../commands/git.ts";
import { detachTmuxClient, killTmuxSession } from "../commands/tmux.ts";
import { readTmuxinatorProject } from "../commands/tmuxinator.ts";
import { getCurrentSession } from "./current.ts";
import { sessionIdentifier } from "./identifier.ts";
import { worktreePath } from "./paths.ts";
import { removeSessionStateFiles } from "./state.ts";
import { existsSync } from "node:fs";

/**
 * Deletes an orc session. Detaches the tmux client first if it is attached to the target session,
 * removes the Git worktree (if one exists at the orc cache path), kills the tmux session, and
 * cleans up any agent state files left behind. Does not delete the underlying branch.
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

  await killTmuxSession(sessionIdentifier(project, session));
  await removeSessionStateFiles(project, session);
}
