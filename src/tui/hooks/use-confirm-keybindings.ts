import { useInput } from "ink";
import { useState } from "react";

/** Which Confirm button currently has focus. */
export type FocusedButton = "yes" | "no";

/**
 * Owns the Confirm modal's focus state and input handling. Returns the currently focused button.
 *
 * Input mapping:
 *
 * - `y` or focus on Yes + enter: `onYes`.
 * - `n`, focus on No + enter, or escape: `onNo`.
 * - Right arrow / `l`: focus the No button.
 * - Left arrow / `h`: focus the Yes button.
 *
 * @param onYes Fires when the user picks Yes.
 * @param onNo Fires when the user picks No, presses escape, or otherwise dismisses the modal.
 * @returns The currently focused button.
 */
export function useConfirmKeybindings(onYes: () => void, onNo: () => void): FocusedButton {
  const [focused, setFocused] = useState<FocusedButton>("yes");

  useInput((input, key) => {
    if (key.escape) {
      onNo();
      return;
    }

    if (key.return) {
      if (focused === "yes") onYes();
      else onNo();
      return;
    }

    if (key.rightArrow || input === "l") {
      setFocused("no");
      return;
    }

    if (key.leftArrow || input === "h") {
      setFocused("yes");
      return;
    }

    const lower = input.toLowerCase();
    if (lower === "y") onYes();
    else if (lower === "n") onNo();
  });

  return focused;
}
