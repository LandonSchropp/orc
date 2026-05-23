import { StoreProvider, useStore } from "./store.tsx";
import * as useWindowWidthModule from "./use-window-width.ts";
import { GlobalRegistrator } from "@happy-dom/global-registrator";
import { renderHook } from "@testing-library/react";
import { beforeEach, describe, expect, it, spyOn } from "bun:test";
import type { ReactNode } from "react";

GlobalRegistrator.register();

beforeEach(() => {
  spyOn(useWindowWidthModule, "useWindowWidth").mockReturnValue(100);
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
    it("returns the store's state", () => {
      const { result } = renderHook(() => useStore(), { wrapper });

      expect(result.current).toMatchObject({
        projects: [],
        selectedSessionId: null,
        numberOfColumns: 3,
      });
    });

    it("returns the store actions", () => {
      const { result } = renderHook(() => useStore(), { wrapper });

      expect(typeof result.current.setSessions).toBe("function");
      expect(typeof result.current.setWindowWidth).toBe("function");
    });
  });
});
