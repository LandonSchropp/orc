import { sessionId } from "../commands/tmux.ts";
import {
  IDLE_AGENT_STATUS,
  NOTIFICATION_HOOK_EVENT,
  POST_TOOL_USE_HOOK_EVENT,
  STOP_HOOK_EVENT,
  USER_PROMPT_SUBMIT_HOOK_EVENT,
  WAITING_AGENT_STATUS,
  WORKING_AGENT_STATUS,
} from "../constants.ts";
import { type AgentStatus } from "../types.ts";
import { parseSessionId } from "./id.ts";
import { readStateFile, writeStateFile } from "./state.ts";

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
    case POST_TOOL_USE_HOOK_EVENT:
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
 * The state file is left untouched when its status already matches, so the recorded timestamp keeps
 * marking when the agent entered that status rather than when the latest event fired.
 *
 * @param event - The hook event name from Claude Code.
 * @param paneId - The tmux pane id where the hook fired.
 */
export async function processHookEvent(event: string, paneId: string): Promise<void> {
  const status = eventToStatus(event);
  if (!status) return;

  const id = parseSessionId(await sessionId(paneId));
  if (!id) return;

  const current = await readStateFile(id[0], id[1], paneId);
  if (current?.status === status) return;

  await writeStateFile(id[0], id[1], paneId, status);
}
