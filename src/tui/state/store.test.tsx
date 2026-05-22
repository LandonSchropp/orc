import { StoreProvider, useStore } from "./store.tsx";
import { GlobalRegistrator } from "@happy-dom/global-registrator";
import { renderHook } from "@testing-library/react";
import { describe, expect, it } from "bun:test";
import type { ReactNode } from "react";

GlobalRegistrator.register();

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
        selectedSessionIdentifier: null,
      });
    });

    it("returns the store actions", () => {
      const { result } = renderHook(() => useStore(), { wrapper });
      expect(typeof result.current.setSessions).toBe("function");
    });
  });
});
