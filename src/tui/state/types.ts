import type { Project, Session } from "../../types.ts";

export type StoreState = {
  /** The current list of projects, each holding its grouped sessions. */
  projects: Project[];
  /** The identifier of the currently selected session, or `null` if none. */
  selectedSessionIdentifier: string | null;
};

/** Actions for the state reducer. */
export type StoreAction = { type: "SET_SESSIONS"; sessions: Session[] };
