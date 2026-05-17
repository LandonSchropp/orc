import { statusHookCommand } from "../hooks/status.ts";
import { defineCommand } from "citty";

export const hookCommand = defineCommand({
  meta: {
    name: "hook",
    description: "Internal: Claude Code hook receivers",
    hidden: true,
  },
  subCommands: {
    status: statusHookCommand,
  },
});
