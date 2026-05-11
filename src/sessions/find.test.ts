import { sessionFactory } from "../../test/factories/session.ts";
import type { Session } from "../types.ts";
import { findMatchingSession } from "./find.ts";
import { describe, expect, it, mock } from "bun:test";

const listTmuxSessionsMock = mock((): Promise<Session[]> => Promise.resolve([]));
const getCurrentSessionMock = mock((): Promise<Session | null> => Promise.resolve(null));

await mock.module("../commands/tmux.ts", () => ({
  listTmuxSessions: listTmuxSessionsMock,
}));

await mock.module("./current.ts", () => ({
  getCurrentSession: getCurrentSessionMock,
}));

describe("findMatchingSession", () => {
  describe("when the input is a full project:session", () => {
    describe("when a session matches", () => {
      it("returns the matching session", async () => {
        const a = sessionFactory.build({ project: "p1", session: "a" });
        const b = sessionFactory.build({ project: "p2", session: "a" });
        listTmuxSessionsMock.mockResolvedValue([a, b]);
        expect(await findMatchingSession("p1:a")).toBe(a);
      });
    });

    describe("when no session matches", () => {
      it("returns null", async () => {
        const a = sessionFactory.build({ project: "p1", session: "a" });
        listTmuxSessionsMock.mockResolvedValue([a]);
        expect(await findMatchingSession("p2:a")).toBeNull();
      });
    });
  });

  describe("when the input is a bare session name", () => {
    describe("when it uniquely matches one session", () => {
      it("returns the matching session", async () => {
        const a = sessionFactory.build({ project: "p1", session: "a" });
        const b = sessionFactory.build({ project: "p1", session: "b" });
        listTmuxSessionsMock.mockResolvedValue([a, b]);
        expect(await findMatchingSession("a")).toBe(a);
      });
    });

    describe("when no session matches", () => {
      it("returns null", async () => {
        const a = sessionFactory.build({ project: "p1", session: "a" });
        listTmuxSessionsMock.mockResolvedValue([a]);
        expect(await findMatchingSession("missing")).toBeNull();
      });
    });

    describe("when multiple sessions match", () => {
      describe("when the current session is in one of the matched projects", () => {
        it("returns the session in the current project", async () => {
          const a = sessionFactory.build({ project: "p1", session: "shared" });
          const b = sessionFactory.build({ project: "p2", session: "shared" });
          listTmuxSessionsMock.mockResolvedValue([a, b]);
          getCurrentSessionMock.mockResolvedValue(
            sessionFactory.build({ project: "p1", attached: true }),
          );
          expect(await findMatchingSession("shared")).toBe(a);
        });
      });

      describe("when there is no current session", () => {
        it("returns null", async () => {
          const a = sessionFactory.build({ project: "p1", session: "shared" });
          const b = sessionFactory.build({ project: "p2", session: "shared" });
          listTmuxSessionsMock.mockResolvedValue([a, b]);
          getCurrentSessionMock.mockResolvedValue(null);
          expect(await findMatchingSession("shared")).toBeNull();
        });
      });

      describe("when the current session is in a different project", () => {
        it("returns null", async () => {
          const a = sessionFactory.build({ project: "p1", session: "shared" });
          const b = sessionFactory.build({ project: "p2", session: "shared" });
          listTmuxSessionsMock.mockResolvedValue([a, b]);
          getCurrentSessionMock.mockResolvedValue(
            sessionFactory.build({ project: "p3", attached: true }),
          );
          expect(await findMatchingSession("shared")).toBeNull();
        });
      });
    });
  });
});
