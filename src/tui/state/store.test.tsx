import { StoreProvider, useStore } from "./store.tsx";
import { GlobalRegistrator } from "@happy-dom/global-registrator";
import { renderHook } from "@testing-library/react";
import { describe, expect, it } from "bun:test";
import type { ReactNode } from "react";

GlobalRegistrator.register();

function wrapper(initialWindowWidth: number) {
  return ({ children }: { children: ReactNode }) => (
    <StoreProvider initialWindowWidth={initialWindowWidth}>{children}</StoreProvider>
  );
}

describe("useStore", () => {
  describe("when used outside a StoreProvider", () => {
    it("throws an error", () => {
      expect(() => renderHook(() => useStore())).toThrow();
    });
  });

  describe("when used inside a StoreProvider", () => {
    it("returns the store's state", () => {
      const { result } = renderHook(() => useStore(), { wrapper: wrapper(100) });

      expect(result.current).toMatchObject({
        projects: [],
        selectedSessionId: null,
        numberOfColumns: 3,
      });
    });

    it("returns the store actions", () => {
      const { result } = renderHook(() => useStore(), { wrapper: wrapper(100) });

      expect(typeof result.current.setSessions).toBe("function");
      expect(typeof result.current.setWindowWidth).toBe("function");
    });
  });
});
