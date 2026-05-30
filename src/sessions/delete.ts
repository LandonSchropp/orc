import { removeWorktree } from "../commands/git.ts";
import { detachTmuxClient, killTmuxSession } from "../commands/tmux.ts";
import { readTmuxinatorProject } from "../commands/tmuxinator.ts";
import { exists } from "../utilities/exists.ts";
import { getCurrentSession } from "./current.ts";
import { sessionId } from "./id.ts";
import { worktreePath } from "./paths.ts";
import { removeSessionStateFiles } from "./state.ts";

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

  if (await exists(path)) {
    const { root: repoPath } = await readTmuxinatorProject(project);
    await removeWorktree(repoPath, path);
  }

  await killTmuxSession(sessionId(project, session));
  await removeSessionStateFiles(project, session);
}
