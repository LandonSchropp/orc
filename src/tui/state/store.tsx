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
 * Provides the store state and action callbacks to its descendants. Reads the terminal width via
 * `useWindowWidth` and keeps the store's layout in sync with resize events.
 */
export function StoreProvider({ children }: StoreProviderProps) {
  const windowWidth = useWindowWidth();
  const store = useStoreReducer(windowWidth);
  const { setWindowWidth } = store;

  useEffect(() => {
    setWindowWidth(windowWidth);
  }, [windowWidth, setWindowWidth]);

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
