import { useWindowWidth } from "./use-window-width.ts";
import { GlobalRegistrator } from "@happy-dom/global-registrator";
import { act, renderHook } from "@testing-library/react";
import { beforeEach, describe, expect, it, mock } from "bun:test";
import { EventEmitter } from "node:events";

GlobalRegistrator.register();

let mockStdout: EventEmitter & { columns: number };

await mock.module("ink", () => ({
  useStdout: () => ({ stdout: mockStdout, write: () => {} }),
}));

beforeEach(() => {
  mockStdout = Object.assign(new EventEmitter(), { columns: 100 });
});

describe("useWindowWidth", () => {
  it("returns the current terminal width", () => {
    const { result } = renderHook(() => useWindowWidth());

    expect(result.current).toBe(100);
  });

  describe("when stdout emits a resize event", () => {
    it("updates the width", () => {
      const { result } = renderHook(() => useWindowWidth());

      act(() => {
        mockStdout.columns = 150;
        mockStdout.emit("resize");
      });

      expect(result.current).toBe(150);
    });
  });

  describe("when the hook is unmounted", () => {
    it("removes the resize listener", () => {
      const { unmount } = renderHook(() => useWindowWidth());

      unmount();

      expect(mockStdout.listenerCount("resize")).toBe(0);
    });
  });
});
