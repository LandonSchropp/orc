import { closeCommand } from "./close.ts";
import { deleteCommand } from "./delete.ts";
import { leaveCommand } from "./leave.ts";
import { listCommand } from "./list.ts";
import { newCommand } from "./new.ts";
import { switchCommand } from "./switch.ts";
import { defineCommand } from "citty";

export const orc = defineCommand({
  meta: {
    name: "orc",
    description: "CLI orchestrator for parallel agents using Git worktrees, tmux and Tmuxinator",
  },
  subCommands: {
    new: newCommand,
    list: listCommand,
    switch: switchCommand,
    leave: leaveCommand,
    close: closeCommand,
    delete: deleteCommand,
  },
});
