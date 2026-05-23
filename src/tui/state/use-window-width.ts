import { useStdout } from "ink";
import { useEffect, useState } from "react";

/** Returns the current terminal window width, kept in sync with resize events. */
export function useWindowWidth(): number {
  const { stdout } = useStdout();
  const [width, setWidth] = useState(stdout.columns);

  useEffect(() => {
    const handler = () => setWidth(stdout.columns);

    stdout.on("resize", handler);

    return () => {
      stdout.off("resize", handler);
    };
  }, [stdout]);

  return width;
}
