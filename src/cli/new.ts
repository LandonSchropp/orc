import { createSession } from "../sessions/create.ts";
import { defineCommand } from "citty";

export const newCommand = defineCommand({
  meta: {
    name: "new",
    description: "Create a new Orc session",
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
    worktree: {
      type: "boolean",
      description: "Create a Git worktree for the session (pass --no-worktree to disable)",
      default: true,
    },
  },
  async run({ args }) {
    await createSession(args.project, args.session, { worktree: args.worktree });
  },
});
