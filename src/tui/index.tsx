import { App } from "./app.tsx";
import { StoreProvider } from "./state/store.tsx";
import { render } from "ink";

/** Renders the TUI and resolves once the user exits it. */
export async function runTui() {
  const instance = render(
    <StoreProvider>
      <App />
    </StoreProvider>,
    {
      // Incremental rendering updates only the lines that changed instead of erasing and redrawing
      // the whole frame, which avoids full-screen flashes while scrolling — especially under tmux.
      incrementalRendering: true,
      // The alternate screen buffer renders the TUI on its own screen and restores the original
      // terminal content on exit, so quitting leaves the terminal as it was before launch.
      alternateScreen: true,
    },
  );
  await instance.waitUntilExit();
}
