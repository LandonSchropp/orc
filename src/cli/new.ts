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
      description: 'Session name ("main" runs on the project\'s main worktree)',
      required: true,
    },
  },
  async run({ args }) {
    await createSession(args.project, args.session);
  },
});
