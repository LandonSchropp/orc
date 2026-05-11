import { listTmuxSessions } from "../commands/tmux.ts";
import { defineCommand } from "citty";

export const listCommand = defineCommand({
  meta: {
    name: "list",
    description: "List Orc sessions",
  },
  async run() {
    const sessions = await listTmuxSessions();

    for (const { name, attached } of sessions) {
      process.stdout.write(`${name}${attached ? " (attached)" : ""}\n`);
    }
  },
});
