import { isAgentState } from "../type-guards.ts";
import { type AgentState, type AgentStatus } from "../types.ts";
import { orcCacheDirectory } from "../utilities/xdg.ts";
import { mkdir } from "node:fs/promises";
import { dirname, join } from "node:path";

/**
 * Returns the absolute path to the agent state file for the given session and tmux pane.
 *
 * @param sessionName - The fully qualified tmux session name (`project:session`).
 * @param paneId - The tmux pane identifier (e.g. `%5`).
 * @returns The absolute path under `$XDG_CACHE_HOME/orc/state/<session>/<paneId>.json`.
 */
export function stateFilePath(sessionName: string, paneId: string): string {
  return join(orcCacheDirectory(), "state", sessionName, `${paneId}.json`);
}

/**
 * Writes the given status to the agent state file. Creates parent directories as needed and
 * overwrites any existing file.
 *
 * @param sessionName - The fully qualified tmux session name.
 * @param paneId - The tmux pane identifier.
 * @param status - The agent status to record.
 */
export async function writeStateFile(
  sessionName: string,
  paneId: string,
  status: AgentStatus,
): Promise<void> {
  const path = stateFilePath(sessionName, paneId);
  await mkdir(dirname(path), { recursive: true });
  const state: AgentState = { status, timestamp: new Date().toISOString() };
  await Bun.write(path, JSON.stringify(state));
}

/**
 * Reads the agent state file for the given session and tmux pane.
 *
 * @param sessionName - The fully qualified tmux session name.
 * @param paneId - The tmux pane identifier.
 * @returns The parsed agent state, or `null` if the file does not exist.
 * @throws If the file exists but cannot be parsed or has an invalid shape.
 */
export async function readStateFile(
  sessionName: string,
  paneId: string,
): Promise<AgentState | null> {
  const path = stateFilePath(sessionName, paneId);
  const file = Bun.file(path);
  if (!(await file.exists())) return null;

  const parsed = (await file.json()) as unknown;

  if (!isAgentState(parsed)) {
    throw new Error(`Agent state file at ${path} has an invalid shape`);
  }

  return parsed;
}
