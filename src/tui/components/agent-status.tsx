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

/** Foreground color per status. */
const STATUS_COLORS = {
  [WORKING_AGENT_STATUS]: "green",
  [WAITING_AGENT_STATUS]: "yellow",
  [IDLE_AGENT_STATUS]: "gray",
} as const;

/** Milliseconds between frames for animated status icons. */
const ANIMATION_INTERVAL = 150;

type AgentStatusProps = {
  /** The current status of the agent. */
  status: AgentStatusType;
};

/** Renders the colored icon for an agent's current status, animating multi-frame icons. */
export function AgentStatus({ status }: AgentStatusProps) {
  const icons = STATUS_ICONS[status];
  const ticks = useInterval(ANIMATION_INTERVAL);
  const icon = icons[ticks % icons.length];

  return (
    <Text color={STATUS_COLORS[status]}>
      {icon} {status.toLowerCase()}
    </Text>
  );
}
