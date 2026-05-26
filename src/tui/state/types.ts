import type { Project, Session } from "../../types.ts";

export type StoreState = {
  /** The current list of projects, each holding its grouped sessions. */
  projects: Project[];
  /** The id of the currently selected session, or `null` if none. */
  selectedSessionId: string | null;
  /** The number of session cards that fit across the viewport in a single row. */
  numberOfColumns: number;
  /** The width of the left margin outside the leftmost column. */
  leftMargin: number;
  /** The width of the right margin outside the rightmost column. */
  rightMargin: number;
  /** The height of the terminal window, in rows. */
  windowHeight: number;
  /** The preferred column for vertical movement, remembered across up/down moves. */
  lastSelectedColumn: number | null;
  /** How far the project list is scrolled from the top, in rows. */
  scrollOffset: number;
};

/** Actions for the state reducer. */
export type StoreAction =
  | { type: "SET_SESSIONS"; sessions: Session[] }
  | { type: "SET_WINDOW_SIZE"; windowWidth: number; windowHeight: number }
  | { type: "MOVE_LEFT" }
  | { type: "MOVE_RIGHT" }
  | { type: "MOVE_UP" }
  | { type: "MOVE_DOWN" };
