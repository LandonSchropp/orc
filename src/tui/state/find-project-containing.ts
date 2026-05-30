import type { Project } from "../../types.ts";

/**
 * Finds the project that owns the session with the given id.
 *
 * @param projects The projects to search.
 * @param id The session id to look up.
 * @returns The project containing the session, or `undefined` if none match.
 */
export function findProjectContaining(projects: Project[], id: string | null): Project | undefined {
  return projects.find(({ sessions }) => sessions.some((session) => session.id === id));
}
