import { App } from "./app.tsx";
import { describe, expect, it } from "bun:test";
import { render } from "ink-testing-library";

describe("App", () => {
  it("renders a hello message", () => {
    const { lastFrame } = render(<App />);
    expect(lastFrame()).toContain("Hello, orc!");
  });
});
