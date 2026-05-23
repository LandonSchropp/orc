import type { Session } from "../../types.ts";
import { groupSessionsByProject } from "./group-sessions-by-project.ts";
import * as move from "./move.ts";
import { pickNextSelection } from "./pick-next-selection.ts";
import { sessionColumn } from "./session-column.ts";
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
      const selectedSessionId = pickNextSelection(
        state.projects,
        state.selectedSessionId,
        projects,
      );

      return {
        ...state,
        projects,
        selectedSessionId,
        lastSelectedColumn: sessionColumn(projects, selectedSessionId, state.numberOfColumns),
      };
    }
    case "SET_NUMBER_OF_COLUMNS": {
      return {
        ...state,
        numberOfColumns: action.numberOfColumns,
        lastSelectedColumn: sessionColumn(
          state.projects,
          state.selectedSessionId,
          action.numberOfColumns,
        ),
      };
    }
    case "MOVE_LEFT": {
      const selectedSessionId = move.moveLeft(
        state.projects,
        state.selectedSessionId,
        state.numberOfColumns,
      );

      return {
        ...state,
        selectedSessionId,
        lastSelectedColumn: sessionColumn(state.projects, selectedSessionId, state.numberOfColumns),
      };
    }
    case "MOVE_RIGHT": {
      const selectedSessionId = move.moveRight(
        state.projects,
        state.selectedSessionId,
        state.numberOfColumns,
      );

      return {
        ...state,
        selectedSessionId,
        lastSelectedColumn: sessionColumn(state.projects, selectedSessionId, state.numberOfColumns),
      };
    }
    case "MOVE_UP": {
      return {
        ...state,
        selectedSessionId: move.moveUp(
          state.projects,
          state.selectedSessionId,
          state.lastSelectedColumn,
          state.numberOfColumns,
        ),
      };
    }
    case "MOVE_DOWN": {
      return {
        ...state,
        selectedSessionId: move.moveDown(
          state.projects,
          state.selectedSessionId,
          state.lastSelectedColumn,
          state.numberOfColumns,
        ),
      };
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
    selectedSessionId: null,
    numberOfColumns: initialNumberOfColumns,
    lastSelectedColumn: null,
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

  const moveLeft = useCallback(() => {
    dispatch({ type: "MOVE_LEFT" });
  }, [dispatch]);

  const moveRight = useCallback(() => {
    dispatch({ type: "MOVE_RIGHT" });
  }, [dispatch]);

  const moveUp = useCallback(() => {
    dispatch({ type: "MOVE_UP" });
  }, [dispatch]);

  const moveDown = useCallback(() => {
    dispatch({ type: "MOVE_DOWN" });
  }, [dispatch]);

  return {
    ...state,
    setSessions,
    setNumberOfColumns,
    moveLeft,
    moveRight,
    moveUp,
    moveDown,
  };
}
