import { switchSession } from "../../sessions/switch.ts";
import { findSession } from "../state/find-session.ts";
import { useStore } from "../state/store.tsx";
import { useApp, useInput } from "ink";

/**
 * Handles every key press in the session list view: `q` or escape quits, the arrow keys and their
 * vim equivalents (`k`/up, `j`/down, `h`/left, `l`/right) move the selected session, `enter` or `a`
 * attaches to the selected session, `n` opens the project picker to start a new session, and `d`
 * opens the delete-confirmation modal when a session is selected. Stays silent while a modal is
 * open so the modal's own `useInput` block owns input.
 */
export function useSessionListKeybindings() {
  const { exit } = useApp();
  const {
    activeModal,
    selectedSessionId,
    projects,
    moveUp,
    moveDown,
    moveLeft,
    moveRight,
    confirmDelete,
    selectProject,
  } = useStore();

  function attach() {
    const session = findSession(projects, selectedSessionId);
    if (session) void switchSession(session.project, session.session);
  }

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
      } else if (input === "n") {
        selectProject();
      } else if (input === "d" && selectedSessionId !== null) {
        confirmDelete();
      } else if (input === "a" || key.return) {
        attach();
      }
    },
    { isActive: activeModal === null },
  );
}
