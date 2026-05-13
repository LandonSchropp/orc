import type { Session } from "../types.ts";
import { runAttachedCommand, runCommand, type RunCommandResult } from "./shell.ts";

/** Socket name for orc's isolated tmux server. */
const ORC_SOCKET = "orc";

/** Tab-separated `-F` template for `tmux list-sessions`: name, created timestamp, attached count. */
const SESSION_FORMAT = "#S\t#{session_created}\t#{session_attached}";

/**
 * Checks if tmux is installed and available on PATH.
 *
 * @returns `true` when tmux is installed, otherwise `false`.
 */
export async function isTmuxInstalled(): Promise<boolean> {
  return (await runCommand(["tmux", "-V"])).exitCode === 0;
}

/**
 * Returns `true` if the calling process is inside an orc tmux session. Detected via the `$TMUX`
 * environment variable's socket path.
 *
 * @returns `true` when inside an orc tmux session, otherwise `false`.
 */
export function isInsideTmuxSession(): boolean {
  return process.env.TMUX?.split(",")[0].endsWith(`/${ORC_SOCKET}`) ?? false;
}

/**
 * Runs a tmux command against orc's isolated server.
 *
 * @param args - Arguments to pass to tmux, after the socket flag.
 * @returns The exit code, stdout, and stderr from the command.
 */
function tmux(args: string[]): Promise<RunCommandResult> {
  return runCommand(["tmux", "-L", ORC_SOCKET, ...args]);
}

/** Detaches the current client from the orc tmux server. */
export async function detachTmuxClient(): Promise<void> {
  await tmux(["detach-client"]);
}

/**
 * Switches the current orc tmux client to the session with the given name.
 *
 * @param name - The full `project:session` name to switch to.
 */
export async function switchTmuxSession(name: string): Promise<void> {
  await tmux(["switch-client", "-t", name]);
}

/**
 * Attaches the calling process's terminal to the orc tmux session with the given name. Replaces
 * stdio for the duration of the session.
 *
 * @param name - The full `project:session` name to attach to.
 */
export async function attachTmuxSession(name: string): Promise<void> {
  await runAttachedCommand(["tmux", "-L", ORC_SOCKET, "attach-session", "-t", name]);
}

/**
 * Lists the tmux sessions running on orc's isolated server. Returns an empty array when no server
 * is running.
 *
 * @returns The parsed tmux sessions.
 * @throws If a session name is malformed or tmux exits with an unexpected error.
 */
export async function listTmuxSessions(): Promise<Session[]> {
  const { exitCode, stdout, stderr } = await tmux(["list-sessions", "-F", SESSION_FORMAT]);

  if (exitCode !== 0) {
    if (stderr.includes("no server running")) return [];
    throw new Error(`tmux list-sessions failed: ${stderr.trim()}`);
  }

  return stdout
    .split("\n")
    .filter((line) => line.length > 0)
    .map(parseSessionLine);
}

/**
 * Parses a single tab-separated line emitted by `tmux list-sessions` using `SESSION_FORMAT`.
 *
 * @param line - A line of tmux output: `name<TAB>created<TAB>attached`.
 * @returns The parsed session.
 * @throws If the session name does not contain a colon.
 */
function parseSessionLine(line: string): Session {
  const [name, createdAt, attached] = line.split("\t");
  const colonIndex = name.indexOf(":");

  if (colonIndex === -1) {
    throw new Error(`Invalid tmux session name: ${name}`);
  }

  return {
    project: name.slice(0, colonIndex),
    session: name.slice(colonIndex + 1),
    name,
    createdAt: new Date(Number(createdAt) * 1000),
    attached: attached === "1",
  };
}
