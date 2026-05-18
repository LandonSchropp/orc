import type { Session, TmuxPane } from "../types.ts";
import { runAttachedCommand, runCommand, type RunCommandResult } from "./shell.ts";

/** Socket name for orc's isolated tmux server. */
export const ORC_SOCKET = "orc";

/** Tab-separated `-F` template for `tmux list-sessions`: name, created timestamp, attached count. */
const SESSION_FORMAT = "#S\t#{session_created}\t#{session_attached}";

/** Tab-separated `-F` template for `tmux list-panes`: session name, pane id, pane title. */
const PANE_FORMAT = "#{session_name}\t#{pane_id}\t#{pane_title}";

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
export function isInsideOrcTmuxSession(): boolean {
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
 * Returns the orc identifier for the session the given pane belongs to. Runs `tmux display-message`
 * against orc's isolated server.
 *
 * @param paneId - The tmux pane identifier (e.g. `%5`).
 * @returns The session identifier (e.g. `project/feature-a`).
 * @throws If tmux exits with an error.
 */
export async function sessionIdentifier(paneId: string): Promise<string> {
  const { exitCode, stdout, stderr } = await tmux(["display-message", "-p", "-t", paneId, "#S"]);

  if (exitCode !== 0) {
    throw new Error(`tmux display-message failed: ${stderr.trim()}`);
  }

  return stdout.trim();
}

/**
 * Kills the orc tmux session with the given name.
 *
 * @param name - The full `project:session` name to kill.
 * @throws If tmux fails to kill the session.
 */
export async function killTmuxSession(name: string): Promise<void> {
  const { exitCode, stderr } = await tmux(["kill-session", "-t", name]);

  if (exitCode !== 0) {
    throw new Error(`Failed to kill tmux session: ${stderr.trim()}`);
  }
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
 * is running. Sessions whose names do not follow orc's `project/session` convention are skipped so
 * foreign sessions on the orc socket do not break orc commands.
 *
 * @returns The parsed tmux sessions.
 * @throws If tmux exits with an unexpected error.
 */
export async function listTmuxSessions(): Promise<Session[]> {
  const { exitCode, stdout, stderr } = await tmux(["list-sessions", "-F", SESSION_FORMAT]);

  if (exitCode !== 0) {
    if (stderr.includes("no server running") || stderr.includes("error connecting")) return [];
    throw new Error(`tmux list-sessions failed: ${stderr.trim()}`);
  }

  return stdout
    .split("\n")
    .filter((line) => line.length > 0)
    .map(parseSessionLine)
    .filter((session) => session !== null);
}

/**
 * Parses a single tab-separated line emitted by `tmux list-sessions` using `SESSION_FORMAT`.
 * Returns `null` for session names that do not contain a `/`, signalling a foreign session that
 * should be skipped.
 *
 * @param line - A line of tmux output: `name<TAB>created<TAB>attached`.
 * @returns The parsed session, or `null` if the name is not in `project/session` form.
 */
function parseSessionLine(line: string): Session | null {
  const [identifier, createdAt, attached] = line.split("\t");
  const separatorIndex = identifier.indexOf("/");

  if (separatorIndex === -1) return null;

  return {
    project: identifier.slice(0, separatorIndex),
    session: identifier.slice(separatorIndex + 1),
    identifier,
    createdAt: new Date(Number(createdAt) * 1000),
    attached: attached === "1",
    agents: [],
  };
}

/**
 * Lists every tmux pane across every session on orc's isolated server. Returns an empty array when
 * no server is running. Panes whose session names do not follow orc's `project/session` convention
 * are skipped so foreign sessions on the orc socket do not pollute orc's view.
 *
 * @returns The parsed tmux panes.
 * @throws If tmux exits with an unexpected error.
 */
export async function listTmuxPanes(): Promise<TmuxPane[]> {
  const { exitCode, stdout, stderr } = await tmux(["list-panes", "-a", "-F", PANE_FORMAT]);

  if (exitCode !== 0) {
    if (stderr.includes("no server running") || stderr.includes("error connecting")) return [];
    throw new Error(`tmux list-panes failed: ${stderr.trim()}`);
  }

  return stdout
    .split("\n")
    .filter((line) => line.length > 0)
    .map(parsePaneLine)
    .filter((pane) => pane !== null);
}

/**
 * Parses a single tab-separated line emitted by `tmux list-panes` using `PANE_FORMAT`. Returns
 * `null` for session names that do not contain a `/`, signalling a foreign session on the orc
 * socket that should be skipped.
 *
 * @param line - A line of tmux output: `sessionIdentifier<TAB>paneId<TAB>paneTitle`.
 * @returns The parsed pane, or `null` if the session is not in `project/session` form.
 */
function parsePaneLine(line: string): TmuxPane | null {
  const [sessionIdentifier, paneId, paneTitle] = line.split("\t");

  if (!sessionIdentifier.includes("/")) return null;

  return { sessionIdentifier, paneId, paneTitle };
}
