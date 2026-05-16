import { homedir } from "node:os";
import { join } from "node:path";

/**
 * Returns the orc cache path for the given project's session worktree.
 *
 * @param project - The project name.
 * @param session - The session name within the project.
 * @returns The absolute path under `~/.cache/orc/worktrees`.
 */
export function worktreePath(project: string, session: string): string {
  return join(homedir(), ".cache", "orc", "worktrees", project, session);
}
