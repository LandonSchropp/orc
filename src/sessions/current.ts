import { isInsideOrcTmuxSession, listTmuxSessions } from "../commands/tmux.ts";
import type { Session } from "../types.ts";

/**
 * Returns the orc session this process is currently attached to, or `null` if not inside an orc
 * tmux session.
 *
 * @returns The current session, or `null`.
 */
export async function getCurrentSession(): Promise<Session | null> {
  if (!isInsideOrcTmuxSession()) return null;
  return (await listTmuxSessions()).find((session) => session.attached) ?? null;
}
