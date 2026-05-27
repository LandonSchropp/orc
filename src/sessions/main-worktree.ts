import { listTmuxSessions } from "../commands/tmux.ts";
import type { Session } from "../types.ts";

/**
 * Reports whether a session runs on its project's main worktree (as opposed to a dedicated linked
 * worktree).
 *
 * @param session - The session to inspect.
 * @returns `true` when the session is on the main worktree.
 */
export function isMainWorktree(session: Session): boolean {
  return session.worktree === "main";
}

/**
 * Reports whether a project's main worktree is currently occupied by an active session. The main
 * worktree is in use when at least one active session for the project is running on it.
 *
 * @param project - The project name.
 * @returns `true` when an active session for the project is on the main worktree.
 */
export async function isMainWorktreeInUse(project: string): Promise<boolean> {
  const sessions = await listTmuxSessions();

  return sessions.some((session) => session.project === project && isMainWorktree(session));
}
