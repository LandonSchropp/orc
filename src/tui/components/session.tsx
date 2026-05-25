import type { Session as SessionType } from "../../types.ts";
import { COLUMN_WIDTH } from "../state/constants.ts";
import { sessionStatus } from "../state/session-status.ts";
import { useStore } from "../state/store.tsx";
import { AgentStatus } from "./agent-status.tsx";
import { Box, Text } from "ink";

type SessionProps = {
  /** The session to render. */
  session: SessionType;
};

/** A single session showing its name and agent status. */
export function Session({ session }: SessionProps) {
  const { selectedSessionId } = useStore();
  const selected = session.id === selectedSessionId;
  const color = selected ? "gray" : "black";

  // NOTE: SESSION_ROW_HEIGHT in state/constants.ts must match this card's height; update it if the
  // layout changes.
  return (
    <Box width={COLUMN_WIDTH} flexDirection="column">
      <Text color={color}>{"▄".repeat(COLUMN_WIDTH)}</Text>
      <Box flexDirection="column" paddingX={2} backgroundColor={color}>
        <Text bold>{session.session}</Text>
        <AgentStatus status={sessionStatus(session)} selected={selected} />
      </Box>
      <Text color={color}>{"▀".repeat(COLUMN_WIDTH)}</Text>
    </Box>
  );
}
