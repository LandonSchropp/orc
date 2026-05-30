import { openTmuxPopup } from "../commands/tmux.ts";
import { deleteCommand } from "./delete.ts";
import { detachCommand } from "./detach.ts";
import { hookCommand } from "./hook.ts";
import { listCommand } from "./list.ts";
import { newCommand } from "./new.ts";
import { switchCommand } from "./switch.ts";
import { defineCommand } from "citty";

/**
 * Env var set when invoking `orc` inside its own tmux popup so the recursive call skips the popup
 * dispatch and renders the TUI directly.
 */
const POPUP_ENV = "ORC_POPUP";

/**
 * Builds the shell command that re-invokes the current orc process with `ORC_POPUP=1` set. Uses
 * `process.execPath` and `process.argv` so we re-run the exact binary and script the user invoked.
 *
 * @returns The shell command suitable for passing to a tmux popup.
 */
function popupCommand(): string {
  const tokens = [process.execPath, ...process.argv.slice(1)].map((token) => Bun.$.escape(token));
  return `${POPUP_ENV}=1 ${tokens.join(" ")}`;
}

export const orc = defineCommand({
  meta: {
    name: "orc",
    description: "CLI orchestrator for parallel agents using Git worktrees, tmux and Tmuxinator",
  },
  subCommands: {
    new: newCommand,
    list: listCommand,
    switch: switchCommand,
    detach: detachCommand,
    delete: deleteCommand,
    hook: hookCommand,
  },
  async run({ rawArgs }) {
    // Citty runs a parent command's `run` even after it dispatches a subcommand, so only launch the
    // TUI when orc was invoked with no subcommand. Otherwise subcommands boot the TUI, which never
    // exits and hangs the process.
    if (rawArgs.length > 0) return;

    // When the caller is inside a tmux session and not already inside the orc popup, overlay orc as
    // a fullscreen popup over their current pane. The popup re-invokes `orc` with `ORC_POPUP=1` so
    // the recursive call renders the TUI in place instead of opening another popup.
    if (process.env.TMUX !== undefined && process.env[POPUP_ENV] !== "1") {
      await openTmuxPopup(popupCommand());
      return;
    }

    // The import is lazy so subcommands never load the Ink/React module graph at all.
    const { runTui } = await import("../tui/index.tsx");

    await runTui();
  },
});
