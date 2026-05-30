import { useStore } from "../state/store.tsx";
import { useApp, useInput } from "ink";

/**
 * Handles every key press in the session list view: `q` or escape quits, and the arrow keys and
 * their vim equivalents (`k`/up, `j`/down, `h`/left, `l`/right) move the selected session. Stays
 * silent while a modal is open so the modal's own `useInput` block owns input.
 */
export function useSessionListKeybindings() {
  const { exit } = useApp();
  const { activeModal, moveUp, moveDown, moveLeft, moveRight } = useStore();

  useInput(
    (input, key) => {
      if (input === "q" || key.escape) {
        exit();
      } else if (key.upArrow || input === "k") {
        moveUp();
      } else if (key.downArrow || input === "j") {
        moveDown();
      } else if (key.leftArrow || input === "h") {
        moveLeft();
      } else if (key.rightArrow || input === "l") {
        moveRight();
      }
    },
    { isActive: activeModal === null },
  );
}
