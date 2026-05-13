import { findMatchingSession } from "../sessions/find.ts";
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
    feature: {
      type: "positional",
      description: "Feature name",
      required: true,
    },
  },
  async run({ args }) {
    const input = `${args.project}:${args.feature}`;
    const session = await findMatchingSession(input);

    if (!session) {
      process.stderr.write(`Session not found: ${input}\n`);
      return process.exit(1);
    }

    await switchSession(session.name);
  },
});
