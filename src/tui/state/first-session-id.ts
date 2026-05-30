import type { Project } from "../../types.ts";

/**
 * Returns the id of the first session of the first project.
 *
 * @param projects The projects to read from.
 * @returns The id of the first session, or `null` when there are no sessions.
 */
export function firstSessionId(projects: Project[]): string | null {
  return projects[0]?.sessions[0]?.id ?? null;
}
