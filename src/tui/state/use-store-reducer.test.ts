import { sessionFactory } from "../../../test/factories/session.ts";
import { useStoreReducer } from "./use-store-reducer.ts";
import { GlobalRegistrator } from "@happy-dom/global-registrator";
import { act, renderHook } from "@testing-library/react";
import { describe, expect, it } from "bun:test";

GlobalRegistrator.register();

describe("useStoreReducer", () => {
  describe("when first called", () => {
    it("returns an empty sessions list", () => {
      const { result } = renderHook(() => useStoreReducer());
      expect(result.current.sessions).toEqual([]);
    });

    it("returns a null selected session identifier", () => {
      const { result } = renderHook(() => useStoreReducer());
      expect(result.current.selectedSessionIdentifier).toBeNull();
    });
  });

  describe("when setSessions is called", () => {
    it("replaces the sessions list", () => {
      const sessions = sessionFactory.buildList(2);
      const { result } = renderHook(() => useStoreReducer());
      act(() => result.current.setSessions(sessions));
      expect(result.current.sessions).toEqual(sessions);
    });
  });
});
