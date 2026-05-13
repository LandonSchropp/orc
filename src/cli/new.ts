import { defineCommand } from "citty";

export const newCommand = defineCommand({
  meta: {
    name: "new",
    description: "Create a new Orc session",
  },
  args: {
    project: {
      type: "positional",
      description: "Project name",
      required: true,
    },
    session: {
      type: "positional",
      description: "Session name",
      required: true,
    },
  },
});
