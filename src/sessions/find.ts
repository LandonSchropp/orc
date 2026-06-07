import { listTmuxSessions } from "../commands/tmux.ts";
import type { TmuxSession } from "../types.ts";

/**
 * Finds the live tmux session with the given `project` and `session`.
 *
 * @param project The project name.
 * @param session The session name within the project.
 * @returns The matching tmux session, or `null` if none exists.
 */
export async function findSession(project: string, session: string): Promise<TmuxSession | null> {
  const sessions = await listTmuxSessions();
  return (
    sessions.find((candidate) => candidate.project === project && candidate.session === session) ??
    null
  );
}
