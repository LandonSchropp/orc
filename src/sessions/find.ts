import { listTmuxSessions } from "../commands/tmux.ts";
import type { Session } from "../types.ts";

/**
 * Finds the orc session with the given `project` and `session`.
 *
 * @param project The project name.
 * @param session The session name within the project.
 * @returns The matching session, or `null` if none exists.
 */
export async function findSession(project: string, session: string): Promise<Session | null> {
  const sessions = await listTmuxSessions();
  return (
    sessions.find((candidate) => candidate.project === project && candidate.session === session) ??
    null
  );
}
