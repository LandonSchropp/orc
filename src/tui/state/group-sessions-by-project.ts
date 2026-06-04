import { isMainWorktree } from "../../sessions/main-worktree.ts";
import type { Project, Session } from "../../types.ts";
import { compareStrings } from "../../utilities/string.ts";

/**
 * Orders sessions for display: the session on the main worktree comes first, then the rest
 * oldest-first by creation time.
 *
 * @param a The first session to compare.
 * @param b The second session to compare.
 * @returns A negative, zero, or positive number per the array sort contract.
 */
function compareSessions(a: Session, b: Session): number {
  if (isMainWorktree(a) !== isMainWorktree(b)) {
    return isMainWorktree(a) ? -1 : 1;
  }

  return a.createdAt.getTime() - b.createdAt.getTime();
}

/**
 * Groups a flat list of sessions by their project.
 *
 * Projects are returned sorted alphabetically by name. Within each project the main-worktree
 * session comes first, followed by the rest in order of creation.
 *
 * @param sessions The flat list of sessions to group.
 * @returns The projects, each holding its sessions in display order.
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
    sessions: projectSessions.toSorted(compareSessions),
  })).toSorted((a, b) => compareStrings(a.project, b.project));
}
