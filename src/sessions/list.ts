import { listTmuxPanes, listTmuxSessions } from "../commands/tmux.ts";
import { IDLE_AGENT_STATUS } from "../constants.ts";
import type { Agent, Session, TmuxPane } from "../types.ts";
import { isAgentPane } from "./agents.ts";
import { readStateFile } from "./state.ts";

/**
 * Reads the agent state for a single pane and returns the corresponding {@link Agent}. When the
 * state file has not been written yet (e.g. Claude just started and no hook has fired), defaults to
 * {@link IDLE_AGENT_STATUS}.
 *
 * @param pane - The Claude-hosting pane to inspect.
 * @returns The agent for that pane.
 */
async function buildAgent(pane: TmuxPane): Promise<Agent> {
  const state = await readStateFile(pane.sessionIdentifier, pane.paneId);
  return { paneId: pane.paneId, status: state?.status ?? IDLE_AGENT_STATUS };
}

/**
 * Lists every orc session with its currently-running Claude agents attached. Combines tmux session
 * metadata with pane enumeration: panes whose titles match the agent signature are turned into
 * {@link Agent} entries, grouped under the session that owns them.
 *
 * @returns The orc sessions, each with its agents array populated.
 */
export async function listSessions(): Promise<Session[]> {
  const [sessions, panes] = await Promise.all([listTmuxSessions(), listTmuxPanes()]);
  const agentPanes = panes.filter(isAgentPane);

  return Promise.all(
    sessions.map(async (session) => ({
      ...session,
      agents: await Promise.all(
        agentPanes.filter((pane) => pane.sessionIdentifier === session.identifier).map(buildAgent),
      ),
    })),
  );
}
