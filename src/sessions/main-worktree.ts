import type { Session } from "../types.ts";

/** The session name that runs on the project's main worktree rather than a dedicated linked one. */
export const MAIN_SESSION_NAME = "main";

/**
 * Reports whether a session runs on its project's main worktree (as opposed to a dedicated linked
 * worktree).
 *
 * @param session The session to inspect.
 * @returns `true` when the session is on the main worktree.
 */
export function isMainWorktree(session: Session): boolean {
  return session.worktree === "main";
}
