import { previousTmuxSession } from "../../commands/tmux.ts";
import { listSessions } from "../../sessions/list.ts";
import { useEffectAsync } from "../hooks/use-effect-async.ts";
import { useInterval } from "../hooks/use-interval.ts";
import { POLL_INTERVAL } from "./constants.ts";
import { useStoreReducer } from "./use-store-reducer.ts";
import { useWindowSize } from "./use-window-size.ts";
import { createContext, useContext, useEffect, useState } from "react";
import type { ReactNode } from "react";

type StoreContextValue = ReturnType<typeof useStoreReducer>;

const StoreContext = createContext<StoreContextValue | null>(null);

type StoreProviderProps = {
  /** The TUI tree that consumes the store. */
  children: ReactNode;
};

/**
 * Resolves the session the client came from, then mounts the store seeded to select it. Renders
 * nothing until the previous session is known so the initial selection lands on it rather than
 * flashing the first session and then jumping.
 */
export function StoreProvider({ children }: StoreProviderProps) {
  // `undefined` while the previous session is still being resolved; `null` once we know there's none.
  const [selectedSessionId, setSelectedSessionId] = useState<string | null | undefined>(undefined);

  useEffectAsync(async () => {
    setSelectedSessionId(await previousTmuxSession());
  }, []);

  // Hold off on mounting the store until the previous session has resolved, so it can seed the
  // initial selection rather than flashing the first session and then jumping.
  if (selectedSessionId === undefined) {
    return null;
  }

  return <Store selectedSessionId={selectedSessionId}>{children}</Store>;
}

type StoreProps = {
  /** The session to select initially, resolved from the session this process is attached to. */
  selectedSessionId: string | null;
  /** The TUI tree that consumes the store. */
  children: ReactNode;
};

/**
 * Holds the store state and action callbacks for its descendants. Seeds the initial selection with
 * the attached session, keeps the layout in sync with the terminal size, and keeps the session data
 * current as sessions change.
 */
function Store({ selectedSessionId, children }: StoreProps) {
  const { columns, rows } = useWindowSize();
  const ticks = useInterval(POLL_INTERVAL);
  const store = useStoreReducer(columns, rows, selectedSessionId);
  const { setSessions, setWindowSize } = store;

  useEffect(() => {
    setWindowSize(columns, rows);
  }, [columns, rows, setWindowSize]);

  useEffectAsync(async () => {
    setSessions(await listSessions());
  }, [ticks, setSessions]);

  return <StoreContext.Provider value={store}>{children}</StoreContext.Provider>;
}

/**
 * Consumes the store. Throws if used outside a `StoreProvider`.
 *
 * @returns The store's state and action callbacks.
 */
export function useStore(): StoreContextValue {
  const value = useContext(StoreContext);

  if (value === null) {
    throw new Error("useStore must be used within a StoreProvider");
  }

  return value;
}
