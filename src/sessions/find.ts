import { listTmuxSessions } from "../commands/tmux.ts";
import type { Session } from "../types.ts";
import { getCurrentSession } from "./current.ts";

/**
 * Finds a session matching the given input. The input is either a full `project:session` name or a
 * bare session name. When the bare name matches multiple sessions, prefers the one in the current
 * orc project.
 *
 * @param input - A `"project:session"` string or a bare `"session"` string.
 * @returns The matching session, or null if no session matches.
 */
export async function findMatchingSession(input: string): Promise<Session | null> {
  const sessions = await listTmuxSessions();

  // If the input includes the project and session, search for an exact match.
  if (input.includes(":")) {
    return sessions.find(({ name }) => name === input) ?? null;
  }

  // Otherwise, search for matching sessions.
  const matchingSessions = sessions.filter(({ session }) => session === input);

  // If no session matches, throw an error.
  if (matchingSessions.length === 0) return null;

  // If exactly one session was found, return it.
  if (matchingSessions.length === 1) return matchingSessions[0];

  // If there's no attached session, don't return a match
  const currentSession = await getCurrentSession();

  if (!currentSession) {
    return null;
  }

  // If multiple sessions were found, return the one in the current project.
  return matchingSessions.find(({ project }) => project === currentSession.project) ?? null;
}
