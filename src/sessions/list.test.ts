import { paneFactory } from "../../test/factories/pane.ts";
import { sessionFactory } from "../../test/factories/session.ts";
import type { AgentState, Session, TmuxPane } from "../types.ts";
import { listSessions } from "./list.ts";
import { beforeEach, describe, expect, it, mock } from "bun:test";

const listTmuxSessionsMock = mock((): Promise<Session[]> => Promise.resolve([]));
const listTmuxPanesMock = mock((): Promise<TmuxPane[]> => Promise.resolve([]));
const readStateFileMock = mock((): Promise<AgentState | null> => Promise.resolve(null));

await mock.module("../commands/tmux.ts", () => ({
  listTmuxSessions: listTmuxSessionsMock,
  listTmuxPanes: listTmuxPanesMock,
}));

await mock.module("./state.ts", () => ({
  readStateFile: readStateFileMock,
}));

beforeEach(() => {
  listTmuxSessionsMock.mockResolvedValue([]);
  listTmuxPanesMock.mockResolvedValue([]);
  readStateFileMock.mockResolvedValue(null);
});

describe("listSessions", () => {
  describe("when there are no sessions", () => {
    it("returns an empty array", async () => {
      expect(await listSessions()).toEqual([]);
    });
  });

  describe("when a session has no agent panes", () => {
    it("returns the session with an empty agents array", async () => {
      listTmuxSessionsMock.mockResolvedValue([
        sessionFactory.build({ project: "orc", session: "feature-a" }),
      ]);
      listTmuxPanesMock.mockResolvedValue([
        paneFactory.build({ sessionId: "orc/feature-a", paneId: "%1", paneTitle: "nvim" }),
        paneFactory.build({ sessionId: "orc/feature-a", paneId: "%2", paneTitle: "zsh" }),
      ]);

      const [session] = await listSessions();
      expect(session.agents).toEqual([]);
    });
  });

  describe("when a session has one agent pane with a state file", () => {
    it("uses the status and start time from the state file", async () => {
      listTmuxSessionsMock.mockResolvedValue([
        sessionFactory.build({ project: "orc", session: "feature-a" }),
      ]);
      listTmuxPanesMock.mockResolvedValue([
        paneFactory.build({
          sessionId: "orc/feature-a",
          paneId: "%3",
          paneTitle: "⠂ Working",
        }),
      ]);
      readStateFileMock.mockResolvedValue({
        status: "Waiting",
        timestamp: "2026-05-17T00:00:00.000Z",
      });

      const [session] = await listSessions();
      expect(session.agents).toEqual([
        { paneId: "%3", status: "Waiting", updatedAt: new Date("2026-05-17T00:00:00.000Z") },
      ]);
    });
  });

  describe("when an agent pane has no state file yet", () => {
    it("defaults the status to Idle", async () => {
      listTmuxSessionsMock.mockResolvedValue([
        sessionFactory.build({ project: "orc", session: "feature-a" }),
      ]);
      listTmuxPanesMock.mockResolvedValue([
        paneFactory.build({
          sessionId: "orc/feature-a",
          paneId: "%3",
          paneTitle: "✳ Idle",
        }),
      ]);
      readStateFileMock.mockResolvedValue(null);

      const [session] = await listSessions();
      expect(session.agents).toMatchObject([{ paneId: "%3", status: "Idle" }]);
    });
  });

  describe("when a session has multiple agent panes", () => {
    it("returns one agent per Claude pane", async () => {
      listTmuxSessionsMock.mockResolvedValue([
        sessionFactory.build({ project: "orc", session: "feature-a" }),
      ]);
      listTmuxPanesMock.mockResolvedValue([
        paneFactory.build({ sessionId: "orc/feature-a", paneId: "%3", paneTitle: "⠂ A" }),
        paneFactory.build({ sessionId: "orc/feature-a", paneId: "%4", paneTitle: "✳ B" }),
      ]);

      const [session] = await listSessions();
      expect(session.agents.map((agent) => agent.paneId)).toEqual(["%3", "%4"]);
    });
  });

  describe("when there are multiple sessions", () => {
    it("assigns each agent pane to the correct session", async () => {
      listTmuxSessionsMock.mockResolvedValue([
        sessionFactory.build({ project: "orc", session: "feature-a" }),
        sessionFactory.build({ project: "orc", session: "feature-b" }),
      ]);
      listTmuxPanesMock.mockResolvedValue([
        paneFactory.build({ sessionId: "orc/feature-a", paneId: "%3", paneTitle: "⠂ A" }),
        paneFactory.build({ sessionId: "orc/feature-b", paneId: "%5", paneTitle: "⠂ B" }),
      ]);

      const sessions = await listSessions();
      expect(sessions.find((session) => session.id === "orc/feature-a")?.agents).toMatchObject([
        { paneId: "%3", status: "Idle" },
      ]);
      expect(sessions.find((session) => session.id === "orc/feature-b")?.agents).toMatchObject([
        { paneId: "%5", status: "Idle" },
      ]);
    });
  });
});
