import {
  AGENT_STATUSES,
  NOTIFICATION_HOOK_EVENT,
  POST_TOOL_USE_HOOK_EVENT,
  STOP_HOOK_EVENT,
  USER_PROMPT_SUBMIT_HOOK_EVENT,
} from "./constants.ts";
import type { AgentState, AgentStatus, ClaudeSettings, HookPayload, JsonValue } from "./types.ts";

/**
 * Type guard for {@link AgentStatus}. Returns `true` when the value is one of the agent status
 * strings.
 *
 * @param value - The value to check.
 * @returns `true` if `value` is a valid {@link AgentStatus}, otherwise `false`.
 */
export function isAgentStatus(value: unknown): value is AgentStatus {
  return typeof value === "string" && AGENT_STATUSES.some((status) => status === value);
}

/**
 * Type guard for {@link AgentState}. Returns `true` when the value has a valid `status` and a string
 * `timestamp`.
 *
 * @param value - The value to check.
 * @returns `true` if `value` is a valid {@link AgentState}, otherwise `false`.
 */
export function isAgentState(value: unknown): value is AgentState {
  return (
    typeof value === "object" &&
    value !== null &&
    !Array.isArray(value) &&
    "status" in value &&
    "timestamp" in value &&
    isAgentStatus(value.status) &&
    typeof value.timestamp === "string"
  );
}

/**
 * Type guard for {@link HookPayload}. Accepts the four hook events orc handles (`UserPromptSubmit`,
 * `Stop`, `PostToolUse`, `Notification`), and additionally requires a string `notification_type` on
 * `Notification` payloads so they narrow safely.
 *
 * @param value - The value to check.
 * @returns `true` if `value` is a valid {@link HookPayload}, otherwise `false`.
 */
export function isHookPayload(value: unknown): value is HookPayload {
  if (typeof value !== "object" || value === null || Array.isArray(value)) return false;
  const record = value as Record<string, unknown>;

  switch (record.hook_event_name) {
    case USER_PROMPT_SUBMIT_HOOK_EVENT:
    case STOP_HOOK_EVENT:
    case POST_TOOL_USE_HOOK_EVENT:
      return true;
    case NOTIFICATION_HOOK_EVENT:
      return typeof record.notification_type === "string";
    default:
      return false;
  }
}

/**
 * Type guard for {@link ClaudeSettings}. Returns `true` when the value is a JSON object whose
 * optional `hooks` field is itself an object of arrays. Does not deeply validate the matcher /
 * handler entries inside each event array — callers can iterate defensively.
 *
 * @param value - The parsed JSON value to check.
 * @returns `true` if `value` is a valid {@link ClaudeSettings}, otherwise `false`.
 */
export function isClaudeSettings(value: JsonValue): value is ClaudeSettings {
  if (typeof value !== "object" || value === null || Array.isArray(value)) return false;
  if (!("hooks" in value)) return true;
  const { hooks } = value;
  if (typeof hooks !== "object" || hooks === null || Array.isArray(hooks)) return false;
  return Object.values(hooks).every(Array.isArray);
}
