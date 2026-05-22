import { useInterval } from "./use-interval.ts";
import { GlobalRegistrator } from "@happy-dom/global-registrator";
import { act, renderHook } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, jest } from "bun:test";

GlobalRegistrator.register();

describe("useInterval", () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  describe("when the component is mounted", () => {
    it("returns 0", () => {
      const { result } = renderHook(() => useInterval(100));
      expect(result.current).toBe(0);
    });
  });

  describe("when one interval elapses", () => {
    it("returns 1", async () => {
      const { result } = renderHook(() => useInterval(100));
      await act(() => jest.advanceTimersByTime(100));
      expect(result.current).toBe(1);
    });
  });

  describe("when multiple intervals elapse", () => {
    it("returns the number of elapsed intervals", async () => {
      const { result } = renderHook(() => useInterval(100));
      await act(() => jest.advanceTimersByTime(350));
      expect(result.current).toBe(3);
    });
  });

  describe("when the hook is unmounted", () => {
    it("stops advancing the tick count", async () => {
      const { result, unmount } = renderHook(() => useInterval(100));
      await act(() => jest.advanceTimersByTime(100));
      expect(result.current).toBe(1);
      unmount();
      jest.advanceTimersByTime(500);
      expect(result.current).toBe(1);
    });
  });

  describe("when the interval changes", () => {
    it("reschedules to the new interval", async () => {
      const { result, rerender } = renderHook(({ interval }) => useInterval(interval), {
        initialProps: { interval: 100 },
      });
      await act(() => jest.advanceTimersByTime(100));
      expect(result.current).toBe(1);
      rerender({ interval: 200 });
      await act(() => jest.advanceTimersByTime(200));
      expect(result.current).toBe(2);
    });
  });
});
