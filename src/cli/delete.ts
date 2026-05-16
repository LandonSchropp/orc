import { deleteSession } from "../sessions/delete.ts";
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
    await deleteSession(args.project, args.session);
  },
});
