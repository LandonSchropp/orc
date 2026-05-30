/** How often `waitFor` re-evaluates its condition, in milliseconds. */
const INTERVAL = 5;

/** Maximum number of polling attempts before `waitFor` throws. */
const MAX_ATTEMPTS = 50;

/**
 * Polls `condition` until it returns `true`, or throws after the configured number of attempts.
 * Lets a test wait on async work (promises, React renders, Ink input listener registration) without
 * guessing a fixed delay.
 *
 * @param condition The predicate to poll; called each interval until it returns `true`.
 * @throws If the maximum attempts elapse before `condition` returns `true`.
 */
export async function waitFor(condition: () => boolean): Promise<void> {
  for (let attempt = 0; attempt < MAX_ATTEMPTS; attempt++) {
    if (condition()) return;
    await new Promise((resolve) => setTimeout(resolve, INTERVAL));
  }

  throw new Error(`waitFor timed out after ${MAX_ATTEMPTS} attempts`);
}
