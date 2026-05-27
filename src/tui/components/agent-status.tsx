import { IDLE_AGENT_STATUS, WAITING_AGENT_STATUS, WORKING_AGENT_STATUS } from "../../constants.ts";
import type { Agent } from "../../types.ts";
import { formatDuration } from "../../utilities/format-duration.ts";
import { useInterval } from "../hooks/use-interval.ts";
import { Text } from "ink";

/** Nerd-font glyphs per status. Multi-frame arrays animate; single-frame arrays render statically. */
const STATUS_ICONS = {
  [WORKING_AGENT_STATUS]: ["", "", "", "", "", ""],
  [WAITING_AGENT_STATUS]: [""],
  [IDLE_AGENT_STATUS]: ["\u{F0130}"],
} as const;

/** Unselected color per status. */
const UNSELECTED_STATUS_COLORS = {
  [WORKING_AGENT_STATUS]: "green",
  [WAITING_AGENT_STATUS]: "yellow",
  [IDLE_AGENT_STATUS]: "gray",
} as const;

/** Selected color per status. */
const SELECTED_STATUS_COLORS = {
  ...UNSELECTED_STATUS_COLORS,
  [IDLE_AGENT_STATUS]: "white",
} as const;

/** Milliseconds between frames for animated status icons. */
const ANIMATION_INTERVAL = 150;

type AgentStatusProps = {
  /** The agent whose status to render, or `undefined` when the session has no agents. */
  agent: Agent | undefined;
  /** Whether the owning Session is selected. */
  selected?: boolean;
};

/**
 * Renders an agent's status as a colored icon followed by its label. The icon animates while
 * working. With no agent, renders a muted "No agents" placeholder so the card keeps its height.
 * Both go white on a selected Session so they stay visible against the highlight.
 */
export function AgentStatus({ agent, selected }: AgentStatusProps) {
  // Called before the early return so the hook count stays stable when an agent appears or
  // disappears between polls.
  const ticks = useInterval(ANIMATION_INTERVAL);

  if (!agent) {
    return (
      <Text color={selected ? "white" : "gray"} italic>
        {" n/a"}
      </Text>
    );
  }

  const icons = STATUS_ICONS[agent.status];
  const icon = icons[ticks % icons.length];
  const color = (selected ? SELECTED_STATUS_COLORS : UNSELECTED_STATUS_COLORS)[agent.status];

  const timer =
    agent.status === WORKING_AGENT_STATUS
      ? formatDuration(Date.now() - agent.updatedAt.getTime())
      : null;

  return (
    <Text italic>
      <Text color={color}>
        {icon} {agent.status.toLowerCase()}
      </Text>
      {timer !== null && <Text color={selected ? "white" : "gray"}> ({timer})</Text>}
    </Text>
  );
}
