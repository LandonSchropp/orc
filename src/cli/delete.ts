import { defineCommand } from "citty";

export const deleteCommand = defineCommand({
  meta: {
    name: "delete",
    description: "Permanently delete the Orc session and worktree",
  },
  args: {
    feature: {
      type: "positional",
      description: "Name of the feature to delete",
      required: true,
    },
    force: {
      type: "boolean",
      description: "Skip the confirmation prompt",
    },
  },
});
