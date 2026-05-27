import { App } from "./app.tsx";
import { StoreProvider } from "./state/store.tsx";
import { describe, expect, it, mock } from "bun:test";

const waitUntilExitMock = mock(() => Promise.resolve());
const renderMock = mock(() => ({ waitUntilExit: waitUntilExitMock }));

await mock.module("ink", () => ({
  render: renderMock,
}));

const { runTui } = await import("./index.tsx");

describe("runTui", () => {
  it("renders the App inside the StoreProvider and waits for exit", async () => {
    await runTui();
    expect(renderMock).toHaveBeenCalledWith(
      <StoreProvider>
        <App />
      </StoreProvider>,
      { incrementalRendering: true, alternateScreen: true },
    );
    expect(waitUntilExitMock).toHaveBeenCalled();
  });
});
