import { App } from "./app.tsx";
import { describe, expect, it, mock } from "bun:test";
import { createElement } from "react";

const waitUntilExitMock = mock(() => Promise.resolve());
const renderMock = mock(() => ({ waitUntilExit: waitUntilExitMock }));

await mock.module("ink", () => ({
  render: renderMock,
}));

const { runTui } = await import("./index.ts");

describe("runTui", () => {
  it("renders the App and waits for exit", async () => {
    await runTui();
    expect(renderMock).toHaveBeenCalledWith(createElement(App));
    expect(waitUntilExitMock).toHaveBeenCalled();
  });
});
