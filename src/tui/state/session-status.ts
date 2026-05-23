import { IDLE_AGENT_STATUS } from "../../constants.ts";
import type { AgentStatus, Session } from "../../types.ts";

/**
 * Returns the rolled-up status for a session, used to summarize its activity. The first agent's
 * status is used; sessions without agents are treated as idle.
 *
 * @param session The session whose status to derive.
 * @returns The session's effective status.
 */
export function sessionStatus(session: Session): AgentStatus {
  return session.agents[0]?.status ?? IDLE_AGENT_STATUS;
}
