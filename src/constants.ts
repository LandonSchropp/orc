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

/** Claude Code hook event fired when the user submits a prompt. */
export const USER_PROMPT_SUBMIT_HOOK_EVENT = "UserPromptSubmit";

/** Claude Code hook event fired when Claude finishes a turn. */
export const STOP_HOOK_EVENT = "Stop";

/** Claude Code hook event fired for notifications such as permission prompts. */
export const NOTIFICATION_HOOK_EVENT = "Notification";

/** Claude Code hook event fired after a tool finishes running. */
export const POST_TOOL_USE_HOOK_EVENT = "PostToolUse";

/** Claude Code hook events orc subscribes to. */
export const HOOK_EVENTS = [
  USER_PROMPT_SUBMIT_HOOK_EVENT,
  STOP_HOOK_EVENT,
  NOTIFICATION_HOOK_EVENT,
  POST_TOOL_USE_HOOK_EVENT,
] as const;
