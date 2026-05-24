import { useWindowSize } from "./use-window-size.ts";
import { GlobalRegistrator } from "@happy-dom/global-registrator";
import { act, renderHook } from "@testing-library/react";
import { beforeEach, describe, expect, it, mock } from "bun:test";
import { EventEmitter } from "node:events";

GlobalRegistrator.register();

let mockStdout: EventEmitter & { columns: number; rows: number };

await mock.module("ink", () => ({
  useStdout: () => ({ stdout: mockStdout, write: () => {} }),
}));

beforeEach(() => {
  mockStdout = Object.assign(new EventEmitter(), { columns: 100, rows: 30 });
});

describe("useWindowSize", () => {
  it("returns the current terminal size", () => {
    const { result } = renderHook(() => useWindowSize());

    expect(result.current).toEqual({ columns: 100, rows: 30 });
  });

  describe("when stdout emits a resize event", () => {
    it("updates the size", () => {
      const { result } = renderHook(() => useWindowSize());

      act(() => {
        mockStdout.columns = 150;
        mockStdout.rows = 50;
        mockStdout.emit("resize");
      });

      expect(result.current).toEqual({ columns: 150, rows: 50 });
    });
  });

  describe("when the hook is unmounted", () => {
    it("removes the resize listener", () => {
      const { unmount } = renderHook(() => useWindowSize());

      unmount();

      expect(mockStdout.listenerCount("resize")).toBe(0);
    });
  });
});
