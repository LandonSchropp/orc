import { detachTmuxClient, isInsideTmuxSession } from "../commands/tmux.ts";
import { defineCommand } from "citty";

export const detachCommand = defineCommand({
  meta: {
    name: "detach",
    description: "Detach from the current Orc session",
  },
  async run() {
    if (!isInsideTmuxSession()) {
      process.stderr.write("Not currently attached to an Orc session\n");
      return process.exit(1);
    }

    await detachTmuxClient();
  },
});
