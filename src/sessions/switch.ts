import {
  attachTmuxSession,
  isInsideTmuxSession,
  switchTmuxSession,
  tmuxSessionName,
} from "../commands/tmux.ts";

/**
 * Switches to the orc session identified by `project` and `session`. When called from inside an orc
 * tmux session, switches the current client; otherwise attaches the terminal to the session.
 *
 * @param project - The project name.
 * @param session - The session name within the project.
 */
export async function switchSession(project: string, session: string): Promise<void> {
  const name = tmuxSessionName(project, session);
  if (isInsideTmuxSession()) {
    await switchTmuxSession(name);
  } else {
    await attachTmuxSession(name);
  }
}
