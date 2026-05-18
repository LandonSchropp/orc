import { attachTmuxSession, isInsideOrcTmuxSession, switchTmuxSession } from "../commands/tmux.ts";
import { sessionIdentifier } from "./identifier.ts";

/**
 * Switches to the orc session identified by `project` and `session`. When called from inside an orc
 * tmux session, switches the current client; otherwise attaches the terminal to the session.
 *
 * @param project - The project name.
 * @param session - The session name within the project.
 */
export async function switchSession(project: string, session: string): Promise<void> {
  const identifier = sessionIdentifier(project, session);
  if (isInsideOrcTmuxSession()) {
    await switchTmuxSession(identifier);
  } else {
    await attachTmuxSession(identifier);
  }
}
