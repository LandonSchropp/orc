import type { Project } from "../../types.ts";

/**
 * Returns the identifier of the first session of the first project.
 *
 * @param projects The projects to read from.
 * @returns The identifier of the first session, or `null` when there are no sessions.
 */
export function firstSessionIdentifier(projects: Project[]): string | null {
  return projects[0]?.sessions[0]?.identifier ?? null;
}
