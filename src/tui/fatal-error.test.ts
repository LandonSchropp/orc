import { handleFatalErrors } from "./fatal-error.ts";
import { describe, expect, it, mock, spyOn } from "bun:test";
import type { Instance } from "ink";

describe("handleFatalErrors", () => {
  /**
   * Stubs the process hooks and a TUI instance, installs the fatal error handlers, and captures the
   * registered handlers alongside the stubs so a test can fire a handler and assert on the
   * effects.
   *
   * @returns The captured handlers keyed by event name, the `exit` and `stderr.write` spies, and
   *   the instance's `unmount` mock.
   */
  function setup() {
    const handlers: Record<string, (error: unknown) => void> = {};

    spyOn(process, "on").mockImplementation(
      (event: string | symbol, handler: (...args: unknown[]) => void) => {
        handlers[event as string] = handler;
        return process;
      },
    );

    const exit = spyOn(process, "exit").mockImplementation(() => undefined as never);
    const write = spyOn(process.stderr, "write").mockReturnValue(true);
    const unmount = mock();

    handleFatalErrors({ unmount } as unknown as Instance);

    return { handlers, exit, write, unmount };
  }

  describe("when an unhandled rejection occurs", () => {
    it("unmounts the TUI, prints the error, and exits non-zero", () => {
      const { handlers, exit, write, unmount } = setup();

      handlers.unhandledRejection(new Error("boom"));

      expect(unmount).toHaveBeenCalled();
      expect(write).toHaveBeenCalledWith(expect.stringContaining("boom"));
      expect(exit).toHaveBeenCalledWith(1);
    });
  });

  describe("when an uncaught exception occurs", () => {
    it("unmounts the TUI, prints the error, and exits non-zero", () => {
      const { handlers, exit, write, unmount } = setup();

      handlers.uncaughtException(new Error("kaboom"));

      expect(unmount).toHaveBeenCalled();
      expect(write).toHaveBeenCalledWith(expect.stringContaining("kaboom"));
      expect(exit).toHaveBeenCalledWith(1);
    });
  });
});
