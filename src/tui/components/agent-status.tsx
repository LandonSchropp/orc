import { IDLE_AGENT_STATUS, WAITING_AGENT_STATUS, WORKING_AGENT_STATUS } from "../../constants.ts";
import type { AgentStatus as AgentStatusType } from "../../types.ts";
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
  /** The current status of the agent. */
  status: AgentStatusType;
  /** Whether the owning Session is selected. */
  selected?: boolean;
};

/**
 * Renders an agent's status as a colored icon followed by its label. The icon animates while
 * working. Idle renders white on a selected Session so it stays visible against the highlight.
 */
export function AgentStatus({ status, selected }: AgentStatusProps) {
  const icons = STATUS_ICONS[status];
  const ticks = useInterval(ANIMATION_INTERVAL);
  const icon = icons[ticks % icons.length];
  const color = (selected ? SELECTED_STATUS_COLORS : UNSELECTED_STATUS_COLORS)[status];

  return (
    <Text color={color}>
      {icon} {status.toLowerCase()}
    </Text>
  );
}
