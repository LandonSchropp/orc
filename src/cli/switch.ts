import { defineCommand } from "citty";

export const switchCommand = defineCommand({
  meta: {
    name: "switch",
    description: "Attach to an Orc session, either by name or via the session selector",
  },
  args: {
    feature: {
      type: "positional",
      description: "Name of the feature to attach to",
      required: false,
    },
  },
});
