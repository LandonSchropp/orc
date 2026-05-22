import type { Project, Session } from "../../types.ts";

/**
 * Groups a flat list of sessions by their project.
 *
 * Projects appear in the order they are first encountered. Sessions within a project preserve their
 * input order.
 */
export function groupSessionsByProject(sessions: Session[]): Project[] {
  const groups = new Map<string, Session[]>();

  for (const session of sessions) {
    const existing = groups.get(session.project) ?? [];
    existing.push(session);
    groups.set(session.project, existing);
  }

  return Array.from(groups, ([project, projectSessions]) => ({
    project,
    sessions: projectSessions,
  }));
}
