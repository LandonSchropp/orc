import type { Project } from "../../types.ts";
import { findProjectContaining } from "./find-project-containing.ts";
import { firstSessionIdentifier } from "./first-session-identifier.ts";

/**
 * Checks whether any project in the list owns a session with the given identifier.
 *
 * @param projects The projects to search.
 * @param identifier The session identifier to look up.
 * @returns `true` if any project owns a session with that identifier, otherwise `false`.
 */
function isPresent(projects: Project[], identifier: string): boolean {
  return projects.some(({ sessions }) =>
    sessions.some((session) => session.identifier === identifier),
  );
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
 * Picks the session identifier to select after the sessions list changes.
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
 */
export function pickNextSelection(
  previousProjects: Project[],
  previousSelectionSessionIdentifier: string | null,
  nextProjects: Project[],
): string | null {
  // If there are no sessions left, there is nothing to select.
  if (nextProjects.length === 0) {
    return null;
  }

  // If nothing was selected before, default to the first session in the list.
  if (previousSelectionSessionIdentifier === null) {
    return firstSessionIdentifier(nextProjects);
  }

  // If the previously selected session is still present, keep it selected.
  if (isPresent(nextProjects, previousSelectionSessionIdentifier)) {
    return previousSelectionSessionIdentifier;
  }

  const previousSelectedProject = findProjectContaining(
    previousProjects,
    previousSelectionSessionIdentifier,
  );

  // If we can't locate the project that owned the previous selection, default to the first session.
  if (!previousSelectedProject) {
    return firstSessionIdentifier(nextProjects);
  }

  const matchingProject = findProjectByName(nextProjects, previousSelectedProject.project);

  // If the previously selected session's project still exists, search inside it for the nearest
  // surviving session.
  if (matchingProject) {
    const { sessions: previousSessions } = previousSelectedProject;

    const previousIndex = previousSessions.findIndex(
      ({ identifier }) => identifier === previousSelectionSessionIdentifier,
    );

    // Walk the previous order to the right of the removed session, returning the first session
    // that still exists.
    for (let index = previousIndex + 1; index < previousSessions.length; index++) {
      const { identifier } = previousSessions[index];

      if (matchingProject.sessions.some((session) => session.identifier === identifier)) {
        return identifier;
      }
    }

    // Walk the previous order to the left of the removed session, returning the first session that
    // still exists.
    for (let index = previousIndex - 1; index >= 0; index--) {
      const { identifier } = previousSessions[index];

      if (matchingProject.sessions.some((session) => session.identifier === identifier)) {
        return identifier;
      }
    }

    // If none of the previous sessions in that project survived, fall back to the first session of
    // the matching project.
    return matchingProject.sessions[0].identifier;
  }

  const flattenedPreviousSessions = previousProjects.flatMap(({ sessions }) => sessions);

  const previousFlatIndex = flattenedPreviousSessions.findIndex(
    ({ identifier }) => identifier === previousSelectionSessionIdentifier,
  );

  // Walk the flat previous order to the right, returning the first session that still exists.
  for (let index = previousFlatIndex + 1; index < flattenedPreviousSessions.length; index++) {
    const { identifier } = flattenedPreviousSessions[index];

    if (isPresent(nextProjects, identifier)) {
      return identifier;
    }
  }

  // Walk the flat previous order to the left, returning the first session that still exists.
  for (let index = previousFlatIndex - 1; index >= 0; index--) {
    const { identifier } = flattenedPreviousSessions[index];

    if (isPresent(nextProjects, identifier)) {
      return identifier;
    }
  }

  // If none of the previous sessions survived, fall back to the first session of the first
  // project.
  return firstSessionIdentifier(nextProjects);
}
