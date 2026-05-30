import { useStdout } from "ink";
import { useEffect, useState } from "react";

/** The dimensions of the terminal window. */
export type WindowSize = {
  /** The width of the terminal window, in columns. */
  columns: number;
  /** The height of the terminal window, in rows. */
  rows: number;
};

/** Returns the current terminal window size, kept in sync with resize events. */
export function useWindowSize(): WindowSize {
  const { stdout } = useStdout();
  const [size, setSize] = useState<WindowSize>({ columns: stdout.columns, rows: stdout.rows });

  useEffect(() => {
    const handler = () => setSize({ columns: stdout.columns, rows: stdout.rows });
    stdout.on("resize", handler);

    return () => {
      stdout.off("resize", handler);
    };
  }, [stdout]);

  return size;
}
