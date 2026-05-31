import { currentTmuxSession, isInsideOrcTmuxSession } from "../commands/tmux.ts";
import { isDeleteWorker, spawnDeleteWorker } from "../sessions/delete-worker.ts";
import { deleteSession } from "../sessions/delete.ts";
import { sessionId } from "../sessions/id.ts";
import { defineCommand } from "citty";

export const deleteCommand = defineCommand({
  meta: {
    name: "delete",
    description: "Permanently delete the Orc session and worktree",
  },
  args: {
    project: {
      type: "positional",
      description: "Project name",
      required: true,
    },
    session: {
      type: "positional",
      description: "Session name",
      required: true,
    },
  },
  async run({ args }) {
    const deletingCurrentSession =
      !isDeleteWorker() &&
      isInsideOrcTmuxSession() &&
      (await currentTmuxSession()) === sessionId(args.project, args.session);

    // Deleting the session this command runs in would kill its own pane mid-delete, so hand that
    // case to a detached worker that outlives the pane. The worker re-invokes this command flagged
    // to delete in-process; every other case deletes in-process so the caller waits for it.
    if (deletingCurrentSession) {
      spawnDeleteWorker(args.project, args.session);
      return;
    }

    await deleteSession(args.project, args.session);
  },
});
