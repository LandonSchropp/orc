import { defineCommand } from "citty";

export const orc = defineCommand({
  meta: {
    name: "orc",
    description: "CLI orchestrator for parallel agents using Git worktrees, tmux and Tmuxinator",
  },
});
