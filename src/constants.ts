/** The agent status when Claude is actively executing. */
export const WORKING_AGENT_STATUS = "Working";

/** The agent status when Claude is paused awaiting user input or approval. */
export const WAITING_AGENT_STATUS = "Waiting";

/** The agent status when Claude has finished a turn and is sitting at the prompt. */
export const IDLE_AGENT_STATUS = "Idle";

/** All valid agent statuses. Source of truth for both the type and runtime validation. */
export const AGENT_STATUSES = [
  WORKING_AGENT_STATUS,
  WAITING_AGENT_STATUS,
  IDLE_AGENT_STATUS,
] as const;
