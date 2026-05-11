import { attachTmuxSession, isInsideTmuxSession, switchTmuxSession } from "../commands/tmux.ts";

/**
 * Switches to the orc session with the given name. When called from inside an orc tmux session,
 * switches the current client; otherwise attaches the terminal to the session.
 *
 * @param name - The full `project:session` name to switch to.
 */
export async function switchSession(name: string): Promise<void> {
  if (isInsideTmuxSession()) {
    await switchTmuxSession(name);
  } else {
    await attachTmuxSession(name);
  }
}
