import { listTmuxSessions } from "../commands/tmux.ts";
import { defineCommand } from "citty";

export const listCommand = defineCommand({
  meta: {
    name: "list",
    description: "List Orc sessions",
  },
  args: {
    "include-closed": {
      type: "boolean",
      description: "Include closed Orc sessions",
    },
  },
  async run({ args }) {
    if (args["include-closed"]) {
      // TODO: support --include-closed once git worktree tracking is in place
      throw new Error("--include-closed is not yet supported");
    }

    const sessions = await listTmuxSessions();

    for (const { project, session, attached } of sessions) {
      process.stdout.write(`${project}:${session}${attached ? " (attached)" : ""}\n`);
    }
  },
});
