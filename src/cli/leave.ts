import { defineCommand } from "citty";

export const leaveCommand = defineCommand({
  meta: {
    name: "leave",
    description: "Detach from the current Orc session",
  },
});
