import { listSessions } from "../../sessions/list.ts";
import { useInterval } from "../hooks/use-interval.ts";
import { POLL_INTERVAL } from "./constants.ts";
import { useStoreReducer } from "./use-store-reducer.ts";
import { useWindowWidth } from "./use-window-width.ts";
import { createContext, useContext, useEffect } from "react";
import type { ReactNode } from "react";

type StoreContextValue = ReturnType<typeof useStoreReducer>;

const StoreContext = createContext<StoreContextValue | null>(null);

type StoreProviderProps = {
  /** The TUI tree that consumes the store. */
  children: ReactNode;
};

/**
 * Provides the store state and action callbacks to its descendants. Keeps the layout in sync with
 * the terminal size and the session data current as sessions change.
 */
export function StoreProvider({ children }: StoreProviderProps) {
  const windowWidth = useWindowWidth();
  const ticks = useInterval(POLL_INTERVAL);
  const store = useStoreReducer(windowWidth);
  const { setSessions, setWindowWidth } = store;

  useEffect(() => {
    setWindowWidth(windowWidth);
  }, [windowWidth, setWindowWidth]);

  useEffect(() => {
    void listSessions().then(setSessions);
  }, [ticks, setSessions]);

  return <StoreContext.Provider value={store}>{children}</StoreContext.Provider>;
}

/** Consumes the store. Throws if used outside a `StoreProvider`. */
export function useStore(): StoreContextValue {
  const value = useContext(StoreContext);

  if (value === null) {
    throw new Error("useStore must be used within a StoreProvider");
  }

  return value;
}
