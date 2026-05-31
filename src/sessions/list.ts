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
 * @param project The project name owning the pane.
 * @param session The session name within the project.
 * @param pane The Claude-hosting pane to inspect.
 * @returns The agent for that pane.
 */
async function buildAgent(project: string, session: string, pane: TmuxPane): Promise<Agent> {
  const state = await readStateFile(project, session, pane.paneId);

  // No state file yet means the agent has only just appeared, so treat now as when its (idle)
  // status began.
  if (state === null) {
    return { paneId: pane.paneId, status: IDLE_AGENT_STATUS, updatedAt: new Date() };
  }

  return { paneId: pane.paneId, status: state.status, updatedAt: new Date(state.timestamp) };
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
        agentPanes
          .filter((pane) => pane.sessionId === session.id)
          .map((pane) => buildAgent(session.project, session.session, pane)),
      ),
    })),
  );
}
