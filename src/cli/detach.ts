import { detachTmuxClient, isInsideOrcTmuxSession } from "../commands/tmux.ts";
import { defineCommand } from "citty";

export const detachCommand = defineCommand({
  meta: {
    name: "detach",
    description: "Detach from the current Orc session",
  },
  async run() {
    if (!isInsideOrcTmuxSession()) {
      process.stderr.write("Not currently attached to an Orc session\n");
      return process.exit(1);
    }

    await detachTmuxClient();
  },
});
