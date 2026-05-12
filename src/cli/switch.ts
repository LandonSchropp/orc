import { findMatchingSession } from "../sessions/find.ts";
import { switchSession } from "../sessions/switch.ts";
import { defineCommand } from "citty";

export const switchCommand = defineCommand({
  meta: {
    name: "switch",
    description: "Switch to an Orc session by name",
  },
  args: {
    feature: {
      type: "positional",
      description: "Name of the session to switch to",
      required: true,
    },
  },
  async run({ args }) {
    const session = await findMatchingSession(args.feature);

    if (!session) {
      process.stderr.write(`Session not found: ${args.feature}\n`);
      return process.exit(1);
    }

    await switchSession(session.name);
  },
});
