import { sessionFactory } from "../../../test/factories/session.ts";
import { useStoreReducer } from "./use-store-reducer.ts";
import { GlobalRegistrator } from "@happy-dom/global-registrator";
import { act, renderHook } from "@testing-library/react";
import { describe, expect, it } from "bun:test";

GlobalRegistrator.register();

describe("useStoreReducer", () => {
  describe("when first called", () => {
    it("returns an empty projects list", () => {
      const { result } = renderHook(() => useStoreReducer());
      expect(result.current.projects).toEqual([]);
    });

    it("returns a null selected session identifier", () => {
      const { result } = renderHook(() => useStoreReducer());
      expect(result.current.selectedSessionIdentifier).toBeNull();
    });
  });

  describe("when setSessions is called", () => {
    it("groups the sessions by project", () => {
      const a = sessionFactory.build({ project: "orc", session: "a" });
      const b = sessionFactory.build({ project: "notes", session: "b" });
      const { result } = renderHook(() => useStoreReducer());
      act(() => result.current.setSessions([a, b]));
      expect(result.current.projects).toEqual([
        { project: "orc", sessions: [a] },
        { project: "notes", sessions: [b] },
      ]);
    });
  });
});
