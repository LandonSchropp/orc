import type { Instance } from "ink";

/**
 * Installs process-level handlers for unhandled rejections and uncaught exceptions so a crash tears
 * the TUI down cleanly instead of painting over the live screen. Each handler unmounts the TUI,
 * prints the error with Bun's own colorized formatting, and exits non-zero — which leaves the
 * control session's pane dead with the error still visible, thanks to its `remain-on-exit`
 * setting.
 *
 * @param instance The Ink instance rendering the TUI.
 */
export function handleFatalErrors(instance: Instance): void {
  const handle = (error: unknown) => {
    instance.unmount();
    process.stderr.write(`${Bun.inspect(error, { colors: true })}\n`);
    process.exit(1);
  };

  process.on("unhandledRejection", handle);
  process.on("uncaughtException", handle);
}
