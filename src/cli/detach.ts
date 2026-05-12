import { defineCommand } from "citty";

export const detachCommand = defineCommand({
  meta: {
    name: "detach",
    description: "Detach from the current Orc session",
  },
});
