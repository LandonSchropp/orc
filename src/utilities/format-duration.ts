/** Shown in place of the timer once a duration no longer fits the `MM:SS` format. */
export const DURATION_OVERFLOW = "∞";

/**
 * Formats a duration as `MM:SS`, clamping negatives to zero. Durations whose minutes exceed two
 * digits no longer fit the format, so they render as {@link DURATION_OVERFLOW} instead.
 *
 * @param milliseconds - A duration in milliseconds.
 * @returns The `MM:SS` string, or {@link DURATION_OVERFLOW} when the minutes exceed two digits.
 */
export function formatDuration(milliseconds: number): string {
  const totalSeconds = Math.floor(Math.max(0, milliseconds) / 1000);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;

  if (minutes > 99) {
    return DURATION_OVERFLOW;
  }

  return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
}
