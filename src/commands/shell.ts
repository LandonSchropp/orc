/** The result of running a shell command. */
export type RunCommandResult = {
  /** The exit code of the process. */
  exitCode: number;
  /** The standard output of the process. */
  stdout: string;
  /** The standard error of the process. */
  stderr: string;
};

/**
 * Runs a command and captures its output. Returns exit code 127 if the command is not found.
 *
 * @param command - The command and its arguments, e.g. `["git", "--version"]`.
 * @returns The exit code, stdout, and stderr from the process.
 */
export async function runCommand(command: string[]): Promise<RunCommandResult> {
  try {
    const process = Bun.spawn(command, { stdout: "pipe", stderr: "pipe" });

    const [stdout, stderr] = await Promise.all([
      new Response(process.stdout).text(),
      new Response(process.stderr).text(),
    ]);

    return { exitCode: await process.exited, stdout, stderr };
  } catch (error) {
    // If the command doesn't exist, Bun throws ENOENT
    if (error instanceof Error && "code" in error && error.code === "ENOENT") {
      return { exitCode: 127, stdout: "", stderr: "" };
    }

    // Otherwise, let the error pass through
    throw error;
  }
}
