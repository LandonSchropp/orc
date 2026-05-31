import { useEffect } from "react";
import type { DependencyList } from "react";

/**
 * A variant of `useEffect` whose effect is async. The effect's promise is ignored, so the effect
 * can't return a cleanup function — reach for `useEffect` directly when cleanup is needed.
 *
 * @param effect The async effect to run after the component renders.
 * @param deps The dependency list controlling when the effect re-runs, as in `useEffect`.
 */
export function useEffectAsync(effect: () => Promise<void>, deps?: DependencyList): void {
  useEffect(() => {
    void effect();
  }, deps);
}
