import { defineCommand } from "citty";

export const deleteCommand = defineCommand({
  meta: {
    name: "delete",
    description: "Permanently delete the Orc session and worktree",
  },
  args: {
    project: {
      type: "positional",
      description: "Project name",
      required: true,
    },
    feature: {
      type: "positional",
      description: "Feature name",
      required: true,
    },
  },
});
