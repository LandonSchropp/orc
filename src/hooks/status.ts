import { isInsideOrcTmuxSession } from "../commands/tmux.ts";
import { processHookEvent } from "../sessions/hook-events.ts";
import { logHookEvent } from "../sessions/hook-log.ts";
import { isHookPayload } from "../type-guards.ts";
import { defineCommand } from "citty";

export const statusHookCommand = defineCommand({
  meta: {
    name: "status",
    description: "Internal: receives Claude Code hook events and writes agent state files",
    hidden: true,
  },
  async run() {
    if (!isInsideOrcTmuxSession()) return;

    const paneId = process.env.TMUX_PANE;

    if (!paneId) {
      throw new Error("TMUX_PANE is not set; hook must run inside a tmux pane");
    }

    const payload = await Bun.stdin.json();

    if (!isHookPayload(payload)) {
      throw new Error("Hook payload is missing hook_event_name");
    }

    await logHookEvent(paneId, payload);
    await processHookEvent(payload.hook_event_name, paneId);
  },
});
