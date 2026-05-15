import { tmuxSessionName } from "../commands/tmux.ts";
import { findSession } from "../sessions/find.ts";
import { switchSession } from "../sessions/switch.ts";
import { defineCommand } from "citty";

export const switchCommand = defineCommand({
  meta: {
    name: "switch",
    description: "Switch to an Orc session by name",
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
    const session = await findSession(args.project, args.session);

    if (!session) {
      const name = tmuxSessionName(args.project, args.session);
      process.stderr.write(`Session not found: ${name}\n`);
      return process.exit(1);
    }

    await switchSession(session.project, session.session);
  },
});
