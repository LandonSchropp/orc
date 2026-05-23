import { sessionFactory } from "../../../test/factories/session.ts";
import { useStoreReducer } from "./use-store-reducer.ts";
import { GlobalRegistrator } from "@happy-dom/global-registrator";
import { act, renderHook } from "@testing-library/react";
import { describe, expect, it } from "bun:test";

GlobalRegistrator.register();

describe("useStoreReducer", () => {
  describe("when first called", () => {
    it("returns an empty projects list", () => {
      const { result } = renderHook(() => useStoreReducer(100));

      expect(result.current.projects).toEqual([]);
    });

    it("returns a null selected session id", () => {
      const { result } = renderHook(() => useStoreReducer(100));

      expect(result.current.selectedSessionId).toBeNull();
    });

    it("returns the layout computed from the initial window width", () => {
      const { result } = renderHook(() => useStoreReducer(122));

      expect(result.current.numberOfColumns).toBe(4);
      expect(result.current.leftMargin).toBe(2);
      expect(result.current.rightMargin).toBe(2);
    });

    it("returns a null last selected column", () => {
      const { result } = renderHook(() => useStoreReducer(100));

      expect(result.current.lastSelectedColumn).toBeNull();
    });
  });

  describe("when setSessions is called", () => {
    it("groups the sessions by project", () => {
      const a = sessionFactory.build({ project: "orc", session: "a" });
      const b = sessionFactory.build({ project: "notes", session: "b" });

      const { result } = renderHook(() => useStoreReducer(100));

      act(() => result.current.setSessions([a, b]));

      expect(result.current.projects).toEqual([
        { project: "notes", sessions: [b] },
        { project: "orc", sessions: [a] },
      ]);
    });

    describe("when no session is currently selected", () => {
      it("selects the first session", () => {
        const a = sessionFactory.build({ project: "orc", session: "a" });
        const b = sessionFactory.build({ project: "notes", session: "b" });

        const { result } = renderHook(() => useStoreReducer(100));

        act(() => result.current.setSessions([a, b]));

        expect(result.current.selectedSessionId).toBe("notes/b");
      });
    });

    describe("when the previously selected session is still present", () => {
      it("keeps it selected", () => {
        const a = sessionFactory.build({ project: "orc", session: "a" });
        const b = sessionFactory.build({ project: "orc", session: "b" });
        const c = sessionFactory.build({ project: "orc", session: "c" });

        const { result } = renderHook(() => useStoreReducer(100));

        act(() => result.current.setSessions([a, b]));
        act(() => result.current.setSessions([a, b, c]));

        expect(result.current.selectedSessionId).toBe("orc/a");
      });
    });

    describe("when the previously selected session was removed", () => {
      it("picks the next session in the previous order", () => {
        const a = sessionFactory.build({ project: "orc", session: "a" });
        const b = sessionFactory.build({ project: "orc", session: "b" });
        const c = sessionFactory.build({ project: "orc", session: "c" });

        const { result } = renderHook(() => useStoreReducer(100));

        act(() => result.current.setSessions([a, b, c]));
        act(() => result.current.setSessions([b, c]));

        expect(result.current.selectedSessionId).toBe("orc/b");
      });
    });

    it("recomputes the last selected column from the new projects", () => {
      const a = sessionFactory.build({ project: "orc", session: "a" });
      const aa = sessionFactory.build({ project: "orc", session: "aa" });
      const b = sessionFactory.build({ project: "orc", session: "b" });

      const { result } = renderHook(() => useStoreReducer(100));

      act(() => result.current.setSessions([a, b]));
      act(() => result.current.moveRight());
      act(() => result.current.setSessions([a, aa, b]));

      expect(result.current.lastSelectedColumn).toBe(2);
    });
  });

  describe("when setWindowWidth is called", () => {
    it("updates the layout values", () => {
      const { result } = renderHook(() => useStoreReducer(100));

      act(() => result.current.setWindowWidth(122));

      expect(result.current.numberOfColumns).toBe(4);
      expect(result.current.leftMargin).toBe(2);
      expect(result.current.rightMargin).toBe(2);
    });

    describe("when the number of columns changes", () => {
      it("recomputes the last selected column from the current selection", () => {
        const sessions = ["a", "b", "c"].map((session) =>
          sessionFactory.build({ project: "orc", session }),
        );

        const { result } = renderHook(() => useStoreReducer(100));

        act(() => result.current.setSessions(sessions));
        act(() => result.current.moveRight());
        act(() => result.current.moveRight());
        act(() => result.current.setWindowWidth(62));

        expect(result.current.lastSelectedColumn).toBe(0);
      });
    });

    describe("when the number of columns does not change", () => {
      it("leaves the last selected column unchanged", () => {
        const a = sessionFactory.build({ project: "orc", session: "a" });
        const b = sessionFactory.build({ project: "orc", session: "b" });

        const { result } = renderHook(() => useStoreReducer(100));

        act(() => result.current.setSessions([a, b]));
        act(() => result.current.moveRight());
        act(() => result.current.setWindowWidth(96));

        expect(result.current.lastSelectedColumn).toBe(1);
      });
    });
  });

  describe("when moveLeft is called", () => {
    it("moves the selection to the previous session in the same row", () => {
      const a = sessionFactory.build({ project: "orc", session: "a" });
      const b = sessionFactory.build({ project: "orc", session: "b" });

      const { result } = renderHook(() => useStoreReducer(100));

      act(() => result.current.setSessions([a, b]));
      act(() => result.current.moveLeft());
      act(() => result.current.moveLeft());

      expect(result.current.selectedSessionId).toBe("orc/a");
    });

    it("sets the last selected column to the new column", () => {
      const a = sessionFactory.build({ project: "orc", session: "a" });
      const b = sessionFactory.build({ project: "orc", session: "b" });

      const { result } = renderHook(() => useStoreReducer(100));

      act(() => result.current.setSessions([a, b]));
      act(() => result.current.moveRight());
      act(() => result.current.moveLeft());

      expect(result.current.lastSelectedColumn).toBe(0);
    });
  });

  describe("when moveRight is called", () => {
    it("moves the selection to the next session in the same row", () => {
      const a = sessionFactory.build({ project: "orc", session: "a" });
      const b = sessionFactory.build({ project: "orc", session: "b" });

      const { result } = renderHook(() => useStoreReducer(100));

      act(() => result.current.setSessions([a, b]));
      act(() => result.current.moveRight());

      expect(result.current.selectedSessionId).toBe("orc/b");
    });

    it("sets the last selected column to the new column", () => {
      const a = sessionFactory.build({ project: "orc", session: "a" });
      const b = sessionFactory.build({ project: "orc", session: "b" });

      const { result } = renderHook(() => useStoreReducer(100));

      act(() => result.current.setSessions([a, b]));
      act(() => result.current.moveRight());

      expect(result.current.lastSelectedColumn).toBe(1);
    });
  });

  describe("when moveDown is called", () => {
    it("moves the selection to the next row in the same project", () => {
      const sessions = ["a", "b", "c", "d"].map((session) =>
        sessionFactory.build({ project: "orc", session }),
      );

      const { result } = renderHook(() => useStoreReducer(100));

      act(() => result.current.setSessions(sessions));
      act(() => result.current.moveDown());

      expect(result.current.selectedSessionId).toBe("orc/d");
    });

    it("leaves the last selected column unchanged", () => {
      const sessions = ["a", "b", "c", "d"].map((session) =>
        sessionFactory.build({ project: "orc", session }),
      );

      const { result } = renderHook(() => useStoreReducer(100));

      act(() => result.current.setSessions(sessions));
      act(() => result.current.moveRight());
      act(() => result.current.moveDown());

      expect(result.current.lastSelectedColumn).toBe(1);
    });
  });

  describe("when moveUp is called", () => {
    it("moves the selection to the previous row in the same project", () => {
      const sessions = ["a", "b", "c", "d"].map((session) =>
        sessionFactory.build({ project: "orc", session }),
      );

      const { result } = renderHook(() => useStoreReducer(100));

      act(() => result.current.setSessions(sessions));
      act(() => result.current.moveDown());
      act(() => result.current.moveUp());

      expect(result.current.selectedSessionId).toBe("orc/a");
    });

    it("leaves the last selected column unchanged", () => {
      const sessions = ["a", "b", "c", "d"].map((session) =>
        sessionFactory.build({ project: "orc", session }),
      );

      const { result } = renderHook(() => useStoreReducer(100));

      act(() => result.current.setSessions(sessions));
      act(() => result.current.moveRight());
      act(() => result.current.moveDown());
      act(() => result.current.moveUp());

      expect(result.current.lastSelectedColumn).toBe(1);
    });
  });
});
