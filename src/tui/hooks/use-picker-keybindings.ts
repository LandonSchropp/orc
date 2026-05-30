import { useInput } from "ink";
import { useCallback, useState } from "react";

/** What the Picker's navigation owns: the focused row index and a way to reset it on query change. */
export type PickerKeybindings = {
  /** The index of the currently focused row within the filtered list. */
  focusedIndex: number;
  /** Resets focus to the top of the list (called after the query changes). */
  resetFocus: () => void;
};

/**
 * Owns the Picker's focus state and navigation input. Returns the focused row index plus a reset
 * helper for the caller to invoke whenever the filtered list changes shape.
 *
 * Input mapping:
 *
 * - Down arrow: focus the next row (clamps at the last).
 * - Up arrow: focus the previous row (clamps at the first).
 * - Escape: cancels via `onCancel`.
 *
 * Typing, backspace, and enter are owned by the Picker's `<TextInput>` and its `onSubmit`.
 *
 * @param totalRows The current number of rows the user can navigate, used for clamping.
 * @param onCancel Fires when the user presses escape.
 * @param initialFocus The index to focus when first rendered. Defaults to 0.
 * @returns The focused row index and a reset helper.
 */
export function usePickerKeybindings(
  totalRows: number,
  onCancel: () => void,
  initialFocus = 0,
): PickerKeybindings {
  const [focusedIndex, setFocusedIndex] = useState(initialFocus);

  useInput((_, key) => {
    if (key.escape) {
      onCancel();
      return;
    }

    if (key.downArrow) {
      const lastIndex = Math.max(totalRows - 1, 0);
      setFocusedIndex((current) => Math.min(current + 1, lastIndex));
      return;
    }

    if (key.upArrow) {
      setFocusedIndex((current) => Math.max(current - 1, 0));
    }
  });

  const resetFocus = useCallback(() => setFocusedIndex(0), []);

  return { focusedIndex, resetFocus };
}
