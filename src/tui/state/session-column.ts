import type { Project } from "../../types.ts";
import { findProjectContaining } from "./find-project-containing.ts";

/**
 * Returns the column index of the session with the given id within its visual row.
 *
 * @param projects The current list of projects.
 * @param sessionId The session id to look up, or `null`.
 * @param numberOfColumns The number of cards rendered per row in the viewport.
 * @returns The column index, or `null` when the session can't be located.
 */
export function sessionColumn(
  projects: Project[],
  sessionId: string | null,
  numberOfColumns: number,
): number | null {
  const project = findProjectContaining(projects, sessionId);

  if (!project) {
    return null;
  }

  return project.sessions.findIndex(({ id }) => id === sessionId) % numberOfColumns;
}
