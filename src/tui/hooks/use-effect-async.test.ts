import { useEffectAsync } from "./use-effect-async.ts";
import { GlobalRegistrator } from "@happy-dom/global-registrator";
import { renderHook, waitFor } from "@testing-library/react";
import { describe, expect, it, mock } from "bun:test";
import { useState } from "react";

GlobalRegistrator.register();

describe("useEffectAsync", () => {
  describe("when the component mounts", () => {
    it("runs the effect", () => {
      const effect = mock(() => Promise.resolve());

      renderHook(() => useEffectAsync(effect, []));

      expect(effect).toHaveBeenCalledTimes(1);
    });

    it("applies state set after the async work resolves", async () => {
      const { result } = renderHook(() => {
        const [value, setValue] = useState(0);

        useEffectAsync(async () => {
          await Promise.resolve();
          setValue(42);
        }, []);

        return value;
      });

      await waitFor(() => {
        expect(result.current).toBe(42);
      });
    });
  });

  describe("when the dependencies change", () => {
    it("re-runs the effect", () => {
      const effect = mock(() => Promise.resolve());

      const { rerender } = renderHook(({ dependency }) => useEffectAsync(effect, [dependency]), {
        initialProps: { dependency: 1 },
      });

      rerender({ dependency: 2 });

      expect(effect).toHaveBeenCalledTimes(2);
    });
  });

  describe("when the dependencies are unchanged", () => {
    it("does not re-run the effect", () => {
      const effect = mock(() => Promise.resolve());

      const { rerender } = renderHook(({ dependency }) => useEffectAsync(effect, [dependency]), {
        initialProps: { dependency: 1 },
      });

      rerender({ dependency: 1 });

      expect(effect).toHaveBeenCalledTimes(1);
    });
  });
});
