/**
 * Returns the orc identifier for a session — the combined `project/session` string used as the tmux
 * session name, the worktree key, and the prefix on agent state files.
 *
 * @param project - The project name.
 * @param session - The session name within the project.
 * @returns The `project/session` identifier.
 */
export function sessionIdentifier(project: string, session: string): string {
  return `${project}/${session}`;
}

/**
 * Splits a session identifier back into its project and session parts. Splits on the first slash,
 * so slashes inside the session part are preserved. Returns `null` for identifiers that don't
 * contain a slash (e.g. foreign tmux sessions on the orc socket).
 *
 * @param identifier - The session identifier to parse.
 * @returns A `[project, session]` tuple, or `null` if the identifier has no slash.
 */
export function parseSessionIdentifier(identifier: string): [string, string] | null {
  const slash = identifier.indexOf("/");
  if (slash === -1) return null;
  return [identifier.slice(0, slash), identifier.slice(slash + 1)];
}
