import { App } from "./app.tsx";
import { StoreProvider } from "./state/store.tsx";
import { render } from "ink";

export async function runTui() {
  const instance = render(
    <StoreProvider>
      <App />
    </StoreProvider>,
    // Incremental rendering updates only the lines that changed instead of erasing and redrawing
    // the whole frame, which avoids full-screen flashes while scrolling — especially under tmux.
    { incrementalRendering: true },
  );
  await instance.waitUntilExit();
}
