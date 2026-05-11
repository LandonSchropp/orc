import { sessionFactory } from "../../test/factories/session.ts";
import type { Session } from "../types.ts";
import { getCurrentSession } from "./current.ts";
import { describe, expect, it, mock } from "bun:test";

const isInsideTmuxSessionMock = mock((): boolean => false);
const listTmuxSessionsMock = mock((): Promise<Session[]> => Promise.resolve([]));

await mock.module("../commands/tmux.ts", () => ({
  isInsideTmuxSession: isInsideTmuxSessionMock,
  listTmuxSessions: listTmuxSessionsMock,
}));

describe("getCurrentSession", () => {
  describe("when not inside a tmux session", () => {
    it("returns null", async () => {
      isInsideTmuxSessionMock.mockReturnValue(false);
      expect(await getCurrentSession()).toBeNull();
    });
  });

  describe("when inside a tmux session", () => {
    it("returns the attached session", async () => {
      isInsideTmuxSessionMock.mockReturnValue(true);
      const attached = sessionFactory.build({ session: "feature-a", attached: true });
      const detached = sessionFactory.build({ session: "feature-b", attached: false });
      listTmuxSessionsMock.mockResolvedValue([detached, attached]);
      expect(await getCurrentSession()).toBe(attached);
    });
  });
});
