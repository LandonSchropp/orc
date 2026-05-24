import { sessionFactory } from "../../../test/factories/session.ts";
import * as listSessionsModule from "../../sessions/list.ts";
import { StoreProvider, useStore } from "./store.tsx";
import * as useWindowSizeModule from "./use-window-size.ts";
import { GlobalRegistrator } from "@happy-dom/global-registrator";
import { act, renderHook, waitFor } from "@testing-library/react";
import { beforeEach, describe, expect, it, spyOn } from "bun:test";
import type { ReactNode } from "react";

GlobalRegistrator.register();

beforeEach(() => {
  spyOn(useWindowSizeModule, "useWindowSize").mockReturnValue({ columns: 100, rows: 30 });
  spyOn(listSessionsModule, "listSessions").mockResolvedValue([]);
});

function wrapper({ children }: { children: ReactNode }) {
  return <StoreProvider>{children}</StoreProvider>;
}

describe("useStore", () => {
  describe("when used outside a StoreProvider", () => {
    it("throws an error", () => {
      expect(() => renderHook(() => useStore())).toThrow();
    });
  });

  describe("when used inside a StoreProvider", () => {
    it("returns the store's state", async () => {
      const { result } = renderHook(() => useStore(), { wrapper });
      await act(async () => {});

      expect(result.current).toMatchObject({
        projects: [],
        selectedSessionId: null,
        numberOfColumns: 3,
      });
    });

    it("returns the store actions", async () => {
      const { result } = renderHook(() => useStore(), { wrapper });
      await act(async () => {});

      expect(typeof result.current.setSessions).toBe("function");
      expect(typeof result.current.setWindowWidth).toBe("function");
    });

    it("populates the store with the polled sessions", async () => {
      const session = sessionFactory.build({ project: "orc", session: "a" });
      spyOn(listSessionsModule, "listSessions").mockResolvedValue([session]);

      const { result } = renderHook(() => useStore(), { wrapper });

      await waitFor(() => {
        expect(result.current.projects).toEqual([{ project: "orc", sessions: [session] }]);
      });
    });
  });
});
