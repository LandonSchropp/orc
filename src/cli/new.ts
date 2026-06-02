import { createSession } from "../sessions/create.ts";
import { findSession } from "../sessions/find.ts";
import { sessionId } from "../sessions/id.ts";
import { tmuxinatorSource } from "../sessions/project-sources.ts";
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
    if (await findSession(args.project, args.session)) {
      const name = sessionId(args.project, args.session);
      process.stderr.write(`Session already exists: ${name}\n`);
      return process.exit(1);
    }

    await createSession(await tmuxinatorSource(args.project), args.session);
  },
});
