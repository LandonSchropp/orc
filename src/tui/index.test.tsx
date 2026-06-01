import { App } from "./app.tsx";
import { StoreProvider } from "./state/store.tsx";
import { describe, expect, it, mock } from "bun:test";

const waitUntilExitMock = mock(() => Promise.resolve());
const instance = { waitUntilExit: waitUntilExitMock };
const renderMock = mock(() => instance);
const handleFatalErrorsMock = mock(() => {});

await mock.module("ink", () => ({
  render: renderMock,
}));

await mock.module("./fatal-error.ts", () => ({
  handleFatalErrors: handleFatalErrorsMock,
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

  it("installs fatal error handlers for the rendered instance", async () => {
    await runTui();
    expect(handleFatalErrorsMock).toHaveBeenCalledWith(instance);
  });
});
