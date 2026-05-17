import { AGENT_STATUSES } from "./constants.ts";
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
 * Type guard for {@link HookPayload}. Returns `true` when the value has a string `hook_event_name`.
 *
 * @param value - The value to check.
 * @returns `true` if `value` is a valid {@link HookPayload}, otherwise `false`.
 */
export function isHookPayload(value: unknown): value is HookPayload {
  return (
    typeof value === "object" &&
    value !== null &&
    !Array.isArray(value) &&
    "hook_event_name" in value &&
    typeof value.hook_event_name === "string"
  );
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
