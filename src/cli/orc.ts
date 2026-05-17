import { deleteCommand } from "./delete.ts";
import { detachCommand } from "./detach.ts";
import { hookCommand } from "./hook.ts";
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
    detach: detachCommand,
    delete: deleteCommand,
    hook: hookCommand,
  },
});
