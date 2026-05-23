import type { Session } from "../../types.ts";
import { computeLayout } from "./compute-layout.ts";
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
    case "SET_WINDOW_WIDTH": {
      const layout = computeLayout(action.windowWidth);

      return {
        ...state,
        ...layout,
        lastSelectedColumn:
          layout.numberOfColumns !== state.numberOfColumns
            ? sessionColumn(state.projects, state.selectedSessionId, layout.numberOfColumns)
            : state.lastSelectedColumn,
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
 * @param initialWindowWidth The initial width of the terminal window.
 * @returns An object containing the current store reducer's state and functions to update it.
 */
export function useStoreReducer(initialWindowWidth: number) {
  const [state, dispatch] = useReducer(storeReducer, {
    projects: [],
    selectedSessionId: null,
    ...computeLayout(initialWindowWidth),
    lastSelectedColumn: null,
  });

  const setSessions = useCallback(
    (sessions: Session[]) => {
      dispatch({ type: "SET_SESSIONS", sessions });
    },
    [dispatch],
  );

  const setWindowWidth = useCallback(
    (windowWidth: number) => {
      dispatch({ type: "SET_WINDOW_WIDTH", windowWidth });
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
    setWindowWidth,
    moveLeft,
    moveRight,
    moveUp,
    moveDown,
  };
}
