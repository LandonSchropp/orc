import type { Project } from "../../types.ts";

/**
 * Finds the project that owns the session with the given identifier.
 *
 * @param projects The projects to search.
 * @param identifier The session identifier to look up.
 * @returns The project containing the session, or `undefined` if none match.
 */
export function findProjectContaining(
  projects: Project[],
  identifier: string | null,
): Project | undefined {
  return projects.find(({ sessions }) =>
    sessions.some((session) => session.identifier === identifier),
  );
}
