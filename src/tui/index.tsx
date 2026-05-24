import { App } from "./app.tsx";
import { StoreProvider } from "./state/store.tsx";
import { render } from "ink";

export async function runTui() {
  const instance = render(
    <StoreProvider>
      <App />
    </StoreProvider>,
  );
  await instance.waitUntilExit();
}
