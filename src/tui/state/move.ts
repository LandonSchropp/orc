import type { Project } from "../../types.ts";
import { findProjectContaining } from "./find-project-containing.ts";
import { firstSessionId } from "./first-session-id.ts";

/**
 * Moves the selection one cell to the left.
 *
 * Clamps at the start of the current row and does not wrap across rows.
 *
 * @param projects The current list of projects.
 * @param selectedSessionId The currently selected session id, or `null`.
 * @param numberOfColumns The number of cards rendered per row in the viewport.
 * @returns The new selected session id.
 */
export function moveLeft(
  projects: Project[],
  selectedSessionId: string | null,
  numberOfColumns: number,
): string | null {
  const project = findProjectContaining(projects, selectedSessionId);

  // If the selection isn't found in any project (because it's null or stale), the cursor falls
  // back to the first session so it always lands on a valid cell.
  if (!project) {
    return firstSessionId(projects);
  }

  const sessionIndex = project.sessions.findIndex(({ id }) => id === selectedSessionId);

  const currentColumn = sessionIndex % numberOfColumns;

  // When the selection is already at the start of its row, left movement leaves it in place.
  if (currentColumn === 0) {
    return selectedSessionId;
  }

  return project.sessions[sessionIndex - 1].id;
}

/**
 * Moves the selection one cell to the right.
 *
 * Clamps at the end of the current row and at the last session of the project, and does not wrap
 * across rows.
 *
 * @param projects The current list of projects.
 * @param selectedSessionId The currently selected session id, or `null`.
 * @param numberOfColumns The number of cards rendered per row in the viewport.
 * @returns The new selected session id.
 */
export function moveRight(
  projects: Project[],
  selectedSessionId: string | null,
  numberOfColumns: number,
): string | null {
  const project = findProjectContaining(projects, selectedSessionId);

  // If the selection isn't found in any project (because it's null or stale), the cursor falls
  // back to the first session so it always lands on a valid cell.
  if (!project) {
    return firstSessionId(projects);
  }

  const sessionIndex = project.sessions.findIndex(({ id }) => id === selectedSessionId);

  const currentColumn = sessionIndex % numberOfColumns;

  // Determine the number of columns in the current row, accounting for a partial last row.
  const numberOfColumnsInCurrentRow = Math.min(
    numberOfColumns,
    project.sessions.length - (sessionIndex - currentColumn),
  );

  // When the selection is at the last cell of its row (whether the row is full or partial), don't
  // move right.
  if (currentColumn === numberOfColumnsInCurrentRow - 1) {
    return selectedSessionId;
  }

  return project.sessions[sessionIndex + 1].id;
}
