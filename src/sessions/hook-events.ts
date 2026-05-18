import { sessionIdentifier } from "../commands/tmux.ts";
import {
  IDLE_AGENT_STATUS,
  NOTIFICATION_HOOK_EVENT,
  STOP_HOOK_EVENT,
  USER_PROMPT_SUBMIT_HOOK_EVENT,
  WAITING_AGENT_STATUS,
  WORKING_AGENT_STATUS,
} from "../constants.ts";
import { type AgentStatus } from "../types.ts";
import { writeStateFile } from "./state.ts";

/**
 * Maps a Claude Code hook event name to the agent status it represents. Returns `null` for
 * unrecognized events.
 *
 * @param event - The hook event name from Claude Code.
 * @returns The corresponding agent status, or `null` if the event is not handled.
 */
function eventToStatus(event: string): AgentStatus | null {
  switch (event) {
    case USER_PROMPT_SUBMIT_HOOK_EVENT:
      return WORKING_AGENT_STATUS;
    case STOP_HOOK_EVENT:
      return IDLE_AGENT_STATUS;
    case NOTIFICATION_HOOK_EVENT:
      return WAITING_AGENT_STATUS;
    default:
      return null;
  }
}

/**
 * Processes a Claude Code hook event for the given firing pane. Looks up the session name for the
 * pane and writes the corresponding agent status to its state file. Silently skips events that do
 * not map to a known status.
 *
 * @param event - The hook event name from Claude Code.
 * @param paneId - The tmux pane identifier where the hook fired.
 */
export async function processHookEvent(event: string, paneId: string): Promise<void> {
  const status = eventToStatus(event);
  if (!status) return;

  const identifier = await sessionIdentifier(paneId);
  await writeStateFile(identifier, paneId, status);
}
