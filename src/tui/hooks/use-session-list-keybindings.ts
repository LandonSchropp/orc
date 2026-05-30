import { useStore } from "../state/store.tsx";
import { useApp, useInput } from "ink";

/**
 * Handles every key press in the session list view: `q` or escape quits, the arrow keys and their
 * vim equivalents (`k`/up, `j`/down, `h`/left, `l`/right) move the selected session, and `d` opens
 * the delete-confirmation modal when a session is selected. Stays silent while a modal is open so
 * the modal's own `useInput` block owns input.
 */
export function useSessionListKeybindings() {
  const { exit } = useApp();
  const { activeModal, selectedSessionId, moveUp, moveDown, moveLeft, moveRight, confirmDelete } =
    useStore();

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
      } else if (input === "d" && selectedSessionId !== null) {
        confirmDelete();
      }
    },
    { isActive: activeModal === null },
  );
}
