import { deleteSession } from "../../sessions/delete.ts";
import { findSession } from "../state/find-session.ts";
import { useStore } from "../state/store.tsx";
import { Confirm } from "./confirm.tsx";

/**
 * The delete-confirmation modal. Reads the target session from `selectedSessionId`, deletes it on
 * confirm, and dismisses the modal on either path. Removes the session from the list as soon as the
 * deletion finishes so the list updates without waiting for the next poll.
 */
export function DeleteModal() {
  const { selectedSessionId, projects, cancel, removeSession } = useStore();
  const session = findSession(projects, selectedSessionId);

  if (!session) return null;

  return (
    <Confirm
      title="Confirm"
      message={`Delete session "${session.session}"?`}
      onYes={() => {
        cancel();
        void deleteSession(session.project, session.session).then(() => {
          removeSession(session.id);
        });
      }}
      onNo={cancel}
    />
  );
}
