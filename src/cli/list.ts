import { defineCommand } from "citty";

export const listCommand = defineCommand({
  meta: {
    name: "list",
    description: "List Orc sessions",
  },
  args: {
    "include-closed": {
      type: "boolean",
      description: "Include closed Orc sessions",
    },
  },
});
