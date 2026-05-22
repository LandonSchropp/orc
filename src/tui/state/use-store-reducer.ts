import type { Session } from "../../types.ts";
import { groupSessionsByProject } from "./group-sessions-by-project.ts";
import type { StoreAction, StoreState } from "./types.ts";
import { useCallback, useReducer } from "react";

/** The initial store state used when the TUI first mounts: no projects, no selection. */
export const INITIAL_STORE_STATE: StoreState = {
  projects: [],
  selectedSessionIdentifier: null,
};

/**
 * A pure reducer function that handles store state updates based on action types.
 *
 * @param _state The current store state prior to the action update.
 * @param action The action to apply to the state.
 * @returns The new store state after applying the action.
 */
function storeReducer(_state: StoreState, action: StoreAction): StoreState {
  switch (action.type) {
    case "SET_SESSIONS": {
      return {
        projects: groupSessionsByProject(action.sessions),
        selectedSessionIdentifier: null,
      };
    }
  }
}

/**
 * Custom hook that manages the store reducer.
 *
 * @returns An object containing the current store reducer's state and functions to update it.
 */
export function useStoreReducer() {
  const [state, dispatch] = useReducer(storeReducer, INITIAL_STORE_STATE);

  const setSessions = useCallback(
    (sessions: Session[]) => {
      dispatch({ type: "SET_SESSIONS", sessions });
    },
    [dispatch],
  );

  return { ...state, setSessions };
}
