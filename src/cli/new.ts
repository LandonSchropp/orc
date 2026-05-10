import { defineCommand } from "citty";

export const newCommand = defineCommand({
  meta: {
    name: "new",
    description: "Create a new Orc session",
  },
  args: {
    feature: {
      type: "positional",
      description: "Name of the feature to create",
      required: false,
    },
    from: {
      type: "string",
      description: "Base the worktree on a different branch than the project default",
      required: false,
    },
    project: {
      type: "string",
      description: "Tmuxinator project to spawn from",
      required: false,
    },
  },
});
