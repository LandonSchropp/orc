import type { Session } from "../../types.ts";
import { computeLayout } from "./compute-layout.ts";
import { groupSessionsByProject } from "./group-sessions-by-project.ts";
import * as move from "./move.ts";
import { pickNextSelection } from "./pick-next-selection.ts";
import { scrollOffsetForSelection } from "./scroll-offset-for-selection.ts";
import { sessionColumn } from "./session-column.ts";
import type { StoreAction, StoreState } from "./types.ts";
import { useCallback, useReducer } from "react";

/**
 * A pure reducer that applies an action to the store state. Vertical moves and session updates
 * recompute the scroll offset so the selected session's row stays in view; horizontal moves stay
 * within a row and leave it unchanged. Computing the offset in the same update that changes the
 * selection keeps the move and the scroll in a single render.
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
        scrollOffset: scrollOffsetForSelection(
          projects,
          selectedSessionId,
          state.numberOfColumns,
          state.scrollOffset,
          state.windowHeight,
        ),
      };
    }
    case "SET_WINDOW_SIZE": {
      const layout = computeLayout(action.windowWidth);

      return {
        ...state,
        ...layout,
        windowHeight: action.windowHeight,
        lastSelectedColumn:
          layout.numberOfColumns !== state.numberOfColumns
            ? sessionColumn(state.projects, state.selectedSessionId, layout.numberOfColumns)
            : state.lastSelectedColumn,
        scrollOffset: scrollOffsetForSelection(
          state.projects,
          state.selectedSessionId,
          layout.numberOfColumns,
          state.scrollOffset,
          action.windowHeight,
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
      const selectedSessionId = move.moveUp(
        state.projects,
        state.selectedSessionId,
        state.lastSelectedColumn,
        state.numberOfColumns,
      );

      return {
        ...state,
        selectedSessionId,
        scrollOffset: scrollOffsetForSelection(
          state.projects,
          selectedSessionId,
          state.numberOfColumns,
          state.scrollOffset,
          state.windowHeight,
        ),
      };
    }
    case "MOVE_DOWN": {
      const selectedSessionId = move.moveDown(
        state.projects,
        state.selectedSessionId,
        state.lastSelectedColumn,
        state.numberOfColumns,
      );

      return {
        ...state,
        selectedSessionId,
        scrollOffset: scrollOffsetForSelection(
          state.projects,
          selectedSessionId,
          state.numberOfColumns,
          state.scrollOffset,
          state.windowHeight,
        ),
      };
    }
  }
}

/**
 * Wraps `storeReducer` with the React `useReducer` hook plus action-dispatching callbacks. Owns the
 * initial-state construction and exposes `setWindowSize` so the provider can keep the store's
 * layout and height in sync with resize events. Exported for direct testing; production callers
 * should use `StoreProvider` and `useStore` instead.
 *
 * @param initialWindowWidth The initial width of the terminal window.
 * @param initialWindowHeight The initial height of the terminal window.
 * @returns An object containing the current store state and functions to update it.
 */
export function useStoreReducer(initialWindowWidth: number, initialWindowHeight: number) {
  const [state, dispatch] = useReducer(storeReducer, {
    projects: [],
    selectedSessionId: null,
    ...computeLayout(initialWindowWidth),
    windowHeight: initialWindowHeight,
    lastSelectedColumn: null,
    scrollOffset: 0,
  });

  const setSessions = useCallback(
    (sessions: Session[]) => {
      dispatch({ type: "SET_SESSIONS", sessions });
    },
    [dispatch],
  );

  const setWindowSize = useCallback(
    (windowWidth: number, windowHeight: number) => {
      dispatch({ type: "SET_WINDOW_SIZE", windowWidth, windowHeight });
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
    setWindowSize,
    moveLeft,
    moveRight,
    moveUp,
    moveDown,
  };
}
