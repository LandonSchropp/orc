import { listTmuxSessions } from "../commands/tmux.ts";
import { defineCommand } from "citty";

export const listCommand = defineCommand({
  meta: {
    name: "list",
    description: "List Orc sessions",
  },
  async run() {
    const sessions = await listTmuxSessions();

    for (const { identifier, attached } of sessions) {
      process.stdout.write(`${identifier}${attached ? " (attached)" : ""}\n`);
    }
  },
});
