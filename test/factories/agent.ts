import { IDLE_AGENT_STATUS } from "../../src/constants.ts";
import type { Agent } from "../../src/types.ts";
import { Factory } from "fishery";

export const agentFactory = Factory.define<Agent>(({ sequence }) => ({
  paneId: `%${sequence}`,
  status: IDLE_AGENT_STATUS,
  updatedAt: new Date(),
}));
