import type { Project } from "../../types.ts";
import { findProjectContaining } from "./find-project-containing.ts";
import { firstSessionId } from "./first-session-id.ts";

/**
 * Checks whether any project in the list owns a session with the given id.
 *
 * @param projects The projects to search.
 * @param id The session id to look up.
 * @returns `true` if any project owns a session with that id, otherwise `false`.
 */
function isPresent(projects: Project[], id: string): boolean {
  return projects.some(({ sessions }) => sessions.some((session) => session.id === id));
}

/**
 * Finds a project by its name.
 *
 * @param projects The projects to search.
 * @param name The project name to look up.
 * @returns The project with the matching name, or `undefined` if none match.
 */
function findProjectByName(projects: Project[], name: string): Project | undefined {
  return projects.find(({ project }) => project === name);
}

/**
 * Picks the session id to select after the sessions list changes.
 *
 * Tries, in order, to keep the cursor as close to its previous position as possible:
 *
 * 1. Keep the previously selected session if it still exists.
 * 2. If the previous selection's project survives, take the next session to the right of it in the
 *    previous project's order; fall back to the nearest surviving session to the left.
 * 3. If the project itself is gone, take the first session of the next surviving project to the right
 *    in the previous project order; fall back to the nearest surviving project to the left.
 * 4. Otherwise fall back to the first session of the first project.
 *
 * Returns `null` only when `nextProjects` is empty.
 *
 * @param previousProjects The projects as they were before the change.
 * @param previousSelectionSessionId The id of the previously selected session, or `null`.
 * @param nextProjects The projects after the change.
 * @returns The id of the session to select, or `null` when there are no sessions.
 */
export function pickNextSelection(
  previousProjects: Project[],
  previousSelectionSessionId: string | null,
  nextProjects: Project[],
): string | null {
  // If there are no sessions left, there is nothing to select.
  if (nextProjects.length === 0) {
    return null;
  }

  // If nothing was selected before, default to the first session in the list.
  if (previousSelectionSessionId === null) {
    return firstSessionId(nextProjects);
  }

  // If the previously selected session is still present, keep it selected.
  if (isPresent(nextProjects, previousSelectionSessionId)) {
    return previousSelectionSessionId;
  }

  const previousSelectedProject = findProjectContaining(
    previousProjects,
    previousSelectionSessionId,
  );

  // If we can't locate the project that owned the previous selection, default to the first session.
  if (!previousSelectedProject) {
    return firstSessionId(nextProjects);
  }

  const matchingProject = findProjectByName(nextProjects, previousSelectedProject.project);

  // If the previously selected session's project still exists, search inside it for the nearest
  // surviving session.
  if (matchingProject) {
    const { sessions: previousSessions } = previousSelectedProject;

    const previousIndex = previousSessions.findIndex(({ id }) => id === previousSelectionSessionId);

    // Walk the previous order to the right of the removed session, returning the first session
    // that still exists.
    for (let index = previousIndex + 1; index < previousSessions.length; index++) {
      const { id } = previousSessions[index];

      if (matchingProject.sessions.some((session) => session.id === id)) {
        return id;
      }
    }

    // Walk the previous order to the left of the removed session, returning the first session that
    // still exists.
    for (let index = previousIndex - 1; index >= 0; index--) {
      const { id } = previousSessions[index];

      if (matchingProject.sessions.some((session) => session.id === id)) {
        return id;
      }
    }

    // If none of the previous sessions in that project survived, fall back to the first session of
    // the matching project.
    return matchingProject.sessions[0].id;
  }

  const flattenedPreviousSessions = previousProjects.flatMap(({ sessions }) => sessions);

  const previousFlatIndex = flattenedPreviousSessions.findIndex(
    ({ id }) => id === previousSelectionSessionId,
  );

  // Walk the flat previous order to the right, returning the first session that still exists.
  for (let index = previousFlatIndex + 1; index < flattenedPreviousSessions.length; index++) {
    const { id } = flattenedPreviousSessions[index];

    if (isPresent(nextProjects, id)) {
      return id;
    }
  }

  // Walk the flat previous order to the left, returning the first session that still exists.
  for (let index = previousFlatIndex - 1; index >= 0; index--) {
    const { id } = flattenedPreviousSessions[index];

    if (isPresent(nextProjects, id)) {
      return id;
    }
  }

  // If none of the previous sessions survived, fall back to the first session of the first
  // project.
  return firstSessionId(nextProjects);
}
