import { useStoreReducer } from "./use-store-reducer.ts";
import { createContext, useContext } from "react";
import type { ReactNode } from "react";

type StoreContextValue = ReturnType<typeof useStoreReducer>;

const StoreContext = createContext<StoreContextValue | null>(null);

type StoreProviderProps = {
  /** The TUI tree that consumes the store. */
  children: ReactNode;
};

/** Provides the store state and action callbacks to its descendants. */
export function StoreProvider({ children }: StoreProviderProps) {
  const store = useStoreReducer();
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
