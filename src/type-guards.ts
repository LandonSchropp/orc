import { AGENT_STATUSES } from "./constants.ts";
import type { AgentState, AgentStatus } from "./types.ts";

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
