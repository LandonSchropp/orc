import { useEffect, useState } from "react";

/**
 * Schedules a recurring interval and returns the number of ticks elapsed since mount.
 *
 * @param interval - Milliseconds between ticks.
 * @returns The number of ticks elapsed since mount.
 */
export function useInterval(interval: number): number {
  const [ticks, setTicks] = useState(0);

  useEffect(() => {
    const id = setInterval(() => setTicks((current) => current + 1), interval);
    return () => clearInterval(id);
  }, [interval]);

  return ticks;
}
