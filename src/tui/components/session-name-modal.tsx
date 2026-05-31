import { createSession } from "../../sessions/create.ts";
import { MAIN_SESSION_NAME, isMainWorktree } from "../../sessions/main-worktree.ts";
import { useStore } from "../state/store.tsx";
import { Prompt } from "./prompt.tsx";
import { Text } from "ink";

/**
 * The session-name prompt modal. Reads the picked project from `activeModal`, derives a sensible
 * default name (`"main"` when the project's main worktree is free), and on submit closes the modal
 * and creates the session.
 */
export function SessionNameModal() {
  const { activeModal, projects, cancel } = useStore();

  if (activeModal?.type !== "session-name") return null;

  const { project } = activeModal;
  const projectData = projects.find((entry) => entry.project === project);
  const mainInUse = projectData?.sessions.some(isMainWorktree) ?? false;
  const defaultValue = mainInUse ? "" : MAIN_SESSION_NAME;

  return (
    <Prompt
      title="New Session"
      message={[
        "What would you like to name the",
        <>
          <Text color="blue">{project}</Text> session?
        </>,
      ]}
      defaultValue={defaultValue}
      onSubmit={async (sessionName) => {
        cancel();
        await createSession(project, sessionName);
      }}
      onCancel={cancel}
    />
  );
}
