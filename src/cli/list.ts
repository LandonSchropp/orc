import { listTmuxSessions } from "../commands/tmux.ts";
import { defineCommand } from "citty";

export const listCommand = defineCommand({
  meta: {
    name: "list",
    description: "List Orc sessions",
  },
  async run() {
    const sessions = await listTmuxSessions();

    for (const { id } of sessions) {
      process.stdout.write(`${id}\n`);
    }
  },
});
