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
