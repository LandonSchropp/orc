import type { Project, Session } from "../../types.ts";

export type StoreState = {
  /** The current list of projects, each holding its grouped sessions. */
  projects: Project[];
  /** The identifier of the currently selected session, or `null` if none. */
  selectedSessionIdentifier: string | null;
  /** The number of session cards that fit across the viewport in a single row. */
  numberOfColumns: number;
};

/** Actions for the state reducer. */
export type StoreAction =
  | { type: "SET_SESSIONS"; sessions: Session[] }
  | { type: "SET_NUMBER_OF_COLUMNS"; numberOfColumns: number };
