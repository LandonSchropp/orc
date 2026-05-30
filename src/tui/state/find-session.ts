import type { Project, Session } from "../../types.ts";

/**
 * Finds the session with the given id within the projects list.
 *
 * @param projects The projects to search.
 * @param id The session id to look up.
 * @returns The matching session, or `undefined` if none match.
 */
export function findSession(projects: Project[], id: string | null): Session | undefined {
  if (id === null) return undefined;
  return projects.flatMap((project) => project.sessions).find((session) => session.id === id);
}
