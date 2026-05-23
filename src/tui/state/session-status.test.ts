import { sessionFactory } from "../../../test/factories/session.ts";
import { IDLE_AGENT_STATUS, WAITING_AGENT_STATUS, WORKING_AGENT_STATUS } from "../../constants.ts";
import { sessionStatus } from "./session-status.ts";
import { describe, expect, it } from "bun:test";

describe("sessionStatus", () => {
  describe("when the session has agents", () => {
    it("returns the first agent's status", () => {
      const session = sessionFactory.build({
        agents: [
          { paneId: "%1", status: WAITING_AGENT_STATUS },
          { paneId: "%2", status: WORKING_AGENT_STATUS },
        ],
      });

      expect(sessionStatus(session)).toBe(WAITING_AGENT_STATUS);
    });
  });

  describe("when the session has no agents", () => {
    it("returns idle", () => {
      const session = sessionFactory.build({ agents: [] });

      expect(sessionStatus(session)).toBe(IDLE_AGENT_STATUS);
    });
  });
});
