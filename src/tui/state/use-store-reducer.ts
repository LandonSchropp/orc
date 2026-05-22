import type { Session } from "../../types.ts";
import { groupSessionsByProject } from "./group-sessions-by-project.ts";
import { pickNextSelection } from "./pick-next-selection.ts";
import type { StoreAction, StoreState } from "./types.ts";
import { useCallback, useReducer } from "react";

/**
 * A pure reducer function that handles store state updates based on action types.
 *
 * @param state The current store state prior to the action update.
 * @param action The action to apply to the state.
 * @returns The new store state after applying the action.
 */
function storeReducer(state: StoreState, action: StoreAction): StoreState {
  switch (action.type) {
    case "SET_SESSIONS": {
      const projects = groupSessionsByProject(action.sessions);

      return {
        ...state,
        projects,
        selectedSessionIdentifier: pickNextSelection(
          state.projects,
          state.selectedSessionIdentifier,
          projects,
        ),
      };
    }
    case "SET_NUMBER_OF_COLUMNS": {
      return { ...state, numberOfColumns: action.numberOfColumns };
    }
  }
}

/**
 * Custom hook that manages the store reducer.
 *
 * @param initialNumberOfColumns The initial number of session cards per row in the viewport.
 * @returns An object containing the current store reducer's state and functions to update it.
 */
export function useStoreReducer(initialNumberOfColumns: number) {
  const [state, dispatch] = useReducer(storeReducer, {
    projects: [],
    selectedSessionIdentifier: null,
    numberOfColumns: initialNumberOfColumns,
  });

  const setSessions = useCallback(
    (sessions: Session[]) => {
      dispatch({ type: "SET_SESSIONS", sessions });
    },
    [dispatch],
  );

  const setNumberOfColumns = useCallback(
    (numberOfColumns: number) => {
      dispatch({ type: "SET_NUMBER_OF_COLUMNS", numberOfColumns });
    },
    [dispatch],
  );

  return { ...state, setSessions, setNumberOfColumns };
}
