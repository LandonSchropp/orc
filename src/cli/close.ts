import { defineCommand } from "citty";

export const closeCommand = defineCommand({
  meta: {
    name: "close",
    description: "Kill the Orc session, leaving the worktree and state in place",
  },
  args: {
    feature: {
      type: "positional",
      description: "Name of the feature to close",
      required: false,
    },
  },
});
